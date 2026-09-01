import { MongoClient } from 'mongodb'
import { ensureAmMoreiraDatabase } from '../server/backend/core/bootstrap.mjs'

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI não está definida no ficheiro .env.')
const dbName = process.env.MONGODB_DB || 'ammoreira'
const client = new MongoClient(process.env.MONGODB_URI)
await client.connect()
const db = client.db(dbName)
await ensureAmMoreiraDatabase(db)
console.log(`MongoDB pronta — base: ${dbName}`)
for (const name of Object.keys((await import('../server/backend/core/seed-data.mjs')).seedData)) {
  console.log(`${name}: ${await db.collection(name).countDocuments()} registos`)
}
await client.close()
