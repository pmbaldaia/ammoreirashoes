import { ObjectId } from 'mongodb'
import { getMongoDb, getGridFsBucket } from '../../backend/core/mongo.mjs'

export default defineEventHandler(async (event) => {
  const id = decodeURIComponent(getRouterParam(event, 'path') || '')
  if (!ObjectId.isValid(id)) {
    throw createError({ statusCode: 404, message: 'Ficheiro não encontrado' })
  }

  const objectId = new ObjectId(id)
  const db = await getMongoDb()
  const file = await db.collection('media.files').findOne({ _id: objectId })

  if (!file) {
    throw createError({ statusCode: 404, message: 'Ficheiro não encontrado' })
  }

  setHeader(event, 'Content-Type', file.metadata?.mime || 'application/octet-stream')
  setHeader(event, 'Content-Length', String(file.length))
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  const bucket = await getGridFsBucket()
  return sendStream(event, bucket.openDownloadStream(objectId))
})
