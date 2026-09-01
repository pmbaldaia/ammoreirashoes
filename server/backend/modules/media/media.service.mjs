import crypto from 'node:crypto'
import { ObjectId } from 'mongodb'
import sharp from 'sharp'
import { getMongoDb, getGridFsBucket } from '../../core/mongo.mjs'

const allowed = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
])

const convertibleImages = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

const safe = (name = 'file') =>
  name.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')

const toBuffer = (value = '') =>
  Buffer.from(String(value).replace(/^data:[^;]+;base64,/, ''), 'base64')

export const mediaService = {
  async list(baseUrl = '') {
    const db = await getMongoDb()
    const rows = await db.collection('media.files').find({}).sort({ uploadDate: -1 }).toArray()
    return rows.map((row) => ({
      id: String(row._id),
      name: row.filename,
      url: `${baseUrl}/uploads/${encodeURIComponent(String(row._id))}`,
      size: row.length,
      mime: row.metadata?.mime || 'application/octet-stream',
      updatedAt: row.uploadDate?.toISOString?.() || new Date().toISOString(),
    }))
  },

  async upload(payload, baseUrl = '') {
    if (!allowed.has(payload.mime)) {
      const error = new Error('Tipo de ficheiro não permitido')
      error.statusCode = 400
      throw error
    }

    const sourceBuffer = toBuffer(payload.data)
    if (!sourceBuffer.length || sourceBuffer.length > 8 * 1024 * 1024) {
      const error = new Error('Ficheiro inválido ou superior a 8 MB')
      error.statusCode = 400
      throw error
    }

    let buffer = sourceBuffer
    let mime = payload.mime
    let originalName = safe(payload.filename)

    if (convertibleImages.has(payload.mime)) {
      try {
        buffer = await sharp(sourceBuffer, { animated: false })
          .rotate()
          .webp({ quality: 84, effort: 4 })
          .toBuffer()
        mime = 'image/webp'
        originalName = originalName.replace(/\.[^.]+$/, '') + '.webp'
      } catch {
        const error = new Error('Não foi possível processar a imagem')
        error.statusCode = 400
        throw error
      }
    }

    const bucket = await getGridFsBucket()
    const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${originalName}`
    const stream = bucket.openUploadStream(filename, {
      metadata: {
        mime,
        originalMime: payload.mime,
        originalFilename: safe(payload.filename),
      },
    })

    await new Promise((resolve, reject) => {
      stream.on('error', reject)
      stream.on('finish', resolve)
      stream.end(buffer)
    })

    return {
      id: String(stream.id),
      name: filename,
      url: `${baseUrl}/uploads/${encodeURIComponent(String(stream.id))}`,
      size: buffer.length,
      mime,
    }
  },

  async remove(id) {
    if (!ObjectId.isValid(id)) return false
    const bucket = await getGridFsBucket()
    try {
      await bucket.delete(new ObjectId(id))
      return true
    } catch {
      return false
    }
  },

  async get(id) {
    if (!ObjectId.isValid(id)) return null
    const db = await getMongoDb()
    const row = await db.collection('media.files').findOne({ _id: new ObjectId(id) })
    if (!row) return null
    return {
      id: row._id,
      name: row.filename,
      mime: row.metadata?.mime || 'application/octet-stream',
      size: row.length,
    }
  },
}
