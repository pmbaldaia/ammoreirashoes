import { seedData } from './seed-data.mjs'
import { hashPassword } from './auth.mjs'

const indexSpecs = {
  users: [[{ email: 1 }, { unique: true, sparse: true }], [{ username: 1 }, { unique: true, sparse: true }], [{ role: 1, active: 1 }]],
  pages: [[{ slug: 1 }, { unique: true, sparse: true }], [{ status: 1, publishedAt: -1 }]],
  products: [[{ slug: 1 }, { unique: true, sparse: true }], [{ categoryId: 1, collectionId: 1, status: 1 }], [{ featured: 1, order: 1 }]],
  categories: [[{ slug: 1 }, { unique: true, sparse: true }]],
  collections: [[{ slug: 1 }, { unique: true, sparse: true }]],
  events: [[{ slug: 1 }, { unique: true, sparse: true }], [{ status: 1, startDate: 1 }]],
  contacts: [[{ status: 1, createdAt: -1 }], [{ email: 1 }]],
  media: [[{ title: 'text', alt: 'text' }]],
  auditLogs: [[{ createdAt: -1 }], [{ actorId: 1, resource: 1, action: 1 }]],
  passwordResets: [[{ tokenHash: 1 }, { unique: true }], [{ expiresAt: 1 }, { expireAfterSeconds: 0 }], [{ userId: 1 }]],
}

export async function ensureAmMoreiraDatabase(db) {
  // The complete seed/migration routine performs many writes. In a serverless
  // environment it used to run again on every cold start, making login and
  // password recovery wait tens of seconds even though the database was
  // already configured. An existing CMS user is enough to identify a live,
  // previously initialised database; only a genuinely empty installation
  // needs the full bootstrap.
  const usersCollection = db.collection('users')
  const existingUser = await usersCollection.findOne({}, { projection: { _id: 1 } })
  if (existingUser) {
    // One-time navigation migration for installations created before Contactos
    // became a normal CMS menu item. The marker prevents a deleted/hidden
    // Contactos item from being recreated later, so the CMS remains authoritative.
    const settingsCollection = db.collection('settings')
    const company = await settingsCollection.findOne(
      { id: 'company' },
      { projection: { navigationMenuV2Migrated: 1, homepageEventsCtaV1Migrated: 1 } },
    )
    if (!company?.navigationMenuV2Migrated) {
      const menusCollection = db.collection('menus')
      const existingContactMenu = await menusCollection.findOne({ url: '/contacto', location: 'header' })
      if (!existingContactMenu) {
        const now = new Date().toISOString()
        await menusCollection.updateOne(
          { id: 'menu-contact' },
          {
            $setOnInsert: {
              id: 'menu-contact',
              label: 'Contactos',
              url: '/contacto',
              location: 'header',
              order: 8,
              status: 'active',
              createdAt: now,
              updatedAt: now,
            },
          },
          { upsert: true },
        )
      }
      await settingsCollection.updateOne(
        { id: 'company' },
        { $set: { navigationMenuV2Migrated: true } },
      )
    }
    if (!company?.homepageEventsCtaV1Migrated) {
      // One-time homepage CTA migration. Existing installations used to point
      // this CMS block at Coleções. Move it to Feiras & Eventos in MongoDB;
      // after this migration the block remains fully editable in the CMS.
      await db.collection('contentBlocks').updateOne(
        { id: 'home-collections', pageSlug: 'home' },
        {
          $set: {
            eyebrow: 'Feiras & Eventos',
            title: 'Veja onde nos pode encontrar.',
            content: 'Acompanhe as próximas feiras e eventos da AM Moreira e descubra onde poderá encontrar-nos presencialmente.',
            items: ['Ver feiras e eventos|/eventos'],
            updatedAt: new Date().toISOString(),
          },
        },
      )
      await settingsCollection.updateOne(
        { id: 'company' },
        { $set: { homepageEventsCtaV1Migrated: true } },
      )
    }
    return
  }

  for (const [name, rows] of Object.entries(seedData)) {
    const collection = db.collection(name)
    await collection.createIndex({ id: 1 }, { unique: true, sparse: true })
    for (const row of rows) {
      await collection.updateOne({ id: String(row.id) }, { $setOnInsert: row }, { upsert: true })
      for (const [key, value] of Object.entries(row)) {
        if (key === 'id') continue
        await collection.updateOne({ id: String(row.id), [key]: { $exists: false } }, { $set: { [key]: value } })
      }
    }
  }

  // Migra contas antigas (email) para username sem impedir o login após a atualização.
  const users = usersCollection
  for (const user of await users.find({ username: { $exists: false } }).toArray()) {
    const base = String(user.email || user.id || 'utilizador').split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '-').replace(/^[^a-z0-9]+/, '').slice(0, 24) || 'utilizador'
    let username = base.length >= 3 ? base : `user-${String(user.id).slice(0, 8)}`
    let suffix = 1
    while (await users.findOne({ username, id: { $ne: user.id } })) username = `${base.slice(0, 28)}-${suffix++}`
    await users.updateOne({ _id: user._id }, { $set: { username } })
  }
  for (const [name, indexes] of Object.entries(indexSpecs)) {
    for (const [keys, options] of indexes) await db.collection(name).createIndex(keys, options)
  }

  const adminUsername = process.env.ADMIN_USERNAME?.trim().toLowerCase() || process.env.ADMIN_EMAIL?.trim().toLowerCase().split('@')[0]
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || ''
  const adminPassword = process.env.ADMIN_PASSWORD
  if (adminUsername && adminPassword && adminPassword.length >= 8) {
    const now = new Date().toISOString()
    await db.collection('users').updateOne(
      { username: adminUsername },
      {
        $setOnInsert: {
          id: 'admin',
          name: process.env.ADMIN_NAME?.trim() || 'Administrador',
          username: adminUsername,
          email: adminEmail,
          role: 'admin',
          active: true,
          passwordHash: hashPassword(adminPassword),
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true },
    )
  }
}
