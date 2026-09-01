import { MongoClient } from 'mongodb'
import { ensureAmMoreiraDatabase } from '../server/backend/core/bootstrap.mjs'
import { seedData } from '../server/backend/core/seed-data.mjs'

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI não está definida no ficheiro .env.')

const dbName = process.env.MONGODB_DB || 'ammoreira'
const collectionsToSync = ['settings', 'pages', 'contentBlocks', 'products', 'categories', 'collections', 'events', 'gallery', 'menus']
const client = new MongoClient(process.env.MONGODB_URI)

try {
  await client.connect()
  const db = client.db(dbName)
  await ensureAmMoreiraDatabase(db)

  // Compatibility migration: the previous role name was "editor". Keeping
  // this in the sync makes existing MongoDB installations consistent with the
  // current CMS role name without deleting or recreating users.
  const viewerMigration = await db.collection('users').updateMany(
    { role: 'editor' },
    { $set: { role: 'viewer', updatedAt: new Date().toISOString() } },
  )
  if (viewerMigration.modifiedCount) console.log(`users: ${viewerMigration.modifiedCount} perfis editor migrados para viewer`)

  let updated = 0
  for (const name of collectionsToSync) {
    const rows = seedData[name] || []
    if (!rows.length) continue
    const result = await db.collection(name).bulkWrite(rows.map((row) => ({
      updateOne: {
        filter: { id: String(row.id) },
        update: { $set: { ...row, updatedAt: new Date().toISOString() }, $setOnInsert: { createdAt: new Date().toISOString() } },
        upsert: true,
      },
    })))
    const count = result.matchedCount + result.upsertedCount
    updated += count
    console.log(`${name}: ${count} registos sincronizados`)
  }
  console.log(`Sincronização concluída — ${updated} registos na base ${dbName}.`)
  console.log('Os restantes registos criados no CMS não foram eliminados.')
} finally {
  await client.close()
}
