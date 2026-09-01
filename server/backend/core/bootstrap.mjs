import { seedData } from './seed-data.mjs'
import { hashPassword } from './auth.mjs'

const indexSpecs = {
  users: [[{ email: 1 }, { unique: true, sparse: true }], [{ role: 1, active: 1 }]],
  pages: [[{ slug: 1 }, { unique: true, sparse: true }], [{ status: 1, publishedAt: -1 }]],
  products: [[{ slug: 1 }, { unique: true, sparse: true }], [{ categoryId: 1, collectionId: 1, status: 1 }], [{ featured: 1, order: 1 }]],
  categories: [[{ slug: 1 }, { unique: true, sparse: true }]],
  collections: [[{ slug: 1 }, { unique: true, sparse: true }]],
  events: [[{ slug: 1 }, { unique: true, sparse: true }], [{ status: 1, startDate: 1 }]],
  contacts: [[{ status: 1, createdAt: -1 }], [{ email: 1 }]],
  media: [[{ title: 'text', alt: 'text' }]],
  auditLogs: [[{ createdAt: -1 }], [{ actorId: 1, resource: 1, action: 1 }]],
}

export async function ensureAmMoreiraDatabase(db) {
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

  for (const [name, indexes] of Object.entries(indexSpecs)) {
    for (const [keys, options] of indexes) await db.collection(name).createIndex(keys, options)
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD
  if (adminEmail && adminPassword && adminPassword.length >= 8) {
    const now = new Date().toISOString()
    await db.collection('users').updateOne(
      { email: adminEmail },
      {
        $setOnInsert: {
          id: 'admin',
          name: process.env.ADMIN_NAME?.trim() || 'Administrador',
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
