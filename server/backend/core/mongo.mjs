import { MongoClient, ServerApiVersion, GridFSBucket } from 'mongodb'

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
      // Keep below Netlify's default synchronous function timeout, leaving
      // enough time for Nitro to return a controlled error to the browser.
      serverSelectionTimeoutMS: 8_000,
    })
    globalThis[globalKey] = client.connect().catch((error) => {
      // A temporary Atlas/network failure must not poison a warm Netlify
      // function for all later requests.
      globalThis[globalKey] = null
      throw error
    })
  }
  const client = await globalThis[globalKey]
  // Runtime requests must read only the current MongoDB state. Seeding is an
  // explicit setup action, never a side effect of visiting the site or CMS.
  return client.db(dbName)
}

export async function getGridFsBucket() {
  const db = await getMongoDb()
  return new GridFSBucket(db, { bucketName: 'media' })
}
