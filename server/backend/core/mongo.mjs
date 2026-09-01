import { MongoClient, ServerApiVersion, GridFSBucket } from 'mongodb'
import { ensureAmMoreiraDatabase } from './bootstrap.mjs'

const globalKey = '__amMoreiraMongoClientPromise'

function getConfig() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB || 'ammoreira'
  if (!uri) {
    const error = new Error('MONGODB_URI não está configurada no ficheiro .env')
    error.statusCode = 500
    throw error
  }
  return { uri, dbName }
}

export async function getMongoDb() {
  const { uri, dbName } = getConfig()
  if (!globalThis[globalKey]) {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        // MongoDB text indexes are not part of the Stable API strict surface.
        // Keep Stable API v1 enabled, but allow bootstrap to create the media
        // search index used by the CMS.
        strict: false,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10000,
    })
    globalThis[globalKey] = client.connect()
  }
  const client = await globalThis[globalKey]
  const db = client.db(dbName)
  if (!globalThis.__amMoreiraBootstrapPromise) {
    globalThis.__amMoreiraBootstrapPromise = ensureAmMoreiraDatabase(db).catch((error) => {
      globalThis.__amMoreiraBootstrapPromise = null
      throw error
    })
  }
  await globalThis.__amMoreiraBootstrapPromise
  return db
}

export async function getGridFsBucket() {
  const db = await getMongoDb()
  return new GridFSBucket(db, { bucketName: 'media' })
}
