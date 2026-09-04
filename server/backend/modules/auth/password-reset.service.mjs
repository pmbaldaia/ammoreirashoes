import crypto from 'node:crypto'
import { usersRepository } from '../users/users.repository.mjs'
import { hashPassword, verifyPassword } from '../../core/auth.mjs'
import { getMongoDb } from '../../core/mongo.mjs'

const tokenHash = (token) => crypto.createHmac('sha256', process.env.AUTH_SECRET || 'am-moreira-dev-change-this-secret').update(String(token)).digest('hex')
const emailPattern = /^\S+@\S+\.\S+$/
const resetTtlMs = 15 * 60 * 1000

async function resetCollection() {
  const db = await getMongoDb()
  const collection = db.collection('passwordResets')
  await Promise.all([
    collection.createIndex({ tokenHash: 1 }, { unique: true }),
    collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    collection.createIndex({ userId: 1 }),
  ])
  return collection
}

export const passwordResetService = {
  async create(email) {
    const normalized = String(email || '').trim().toLowerCase()
    if (!emailPattern.test(normalized)) return null
    const user = (await usersRepository.readAll()).find((row) => row.email === normalized && row.active)
    if (!user) return null

    const token = crypto.randomBytes(32).toString('base64url')
    const resets = await resetCollection()
    await resets.deleteMany({ userId: user.id })
    await resets.insertOne({
      userId: user.id,
      tokenHash: tokenHash(token),
      expiresAt: new Date(Date.now() + resetTtlMs),
      createdAt: new Date(),
    })
    return { token, user }
  },

  async complete(token, password, confirmPassword) {
    if (typeof password !== 'string' || password.length < 8) {
      const error = new Error('A nova palavra-passe deve ter pelo menos 8 caracteres')
      error.statusCode = 400
      throw error
    }
    if (password !== confirmPassword) {
      const error = new Error('A confirmação da palavra-passe não coincide')
      error.statusCode = 400
      throw error
    }

    if (typeof token !== 'string' || token.length < 40) {
      const error = new Error('Este link é inválido ou já expirou. Pede uma nova recuperação de palavra-passe.')
      error.statusCode = 400
      throw error
    }
    const resets = await resetCollection()
    const reset = await resets.findOneAndDelete({ tokenHash: tokenHash(token), expiresAt: { $gt: new Date() } })
    const resetData = reset?.value || reset
    if (!resetData?.userId) {
      const error = new Error('Este link é inválido ou já expirou. Pede uma nova recuperação de palavra-passe.')
      error.statusCode = 400
      throw error
    }
    const user = await usersRepository.findById(resetData.userId)
    if (!user || !user.active) { const error = new Error('Este link é inválido ou já expirou. Pede uma nova recuperação de palavra-passe.'); error.statusCode = 400; throw error }
    // Persist the new hash in MongoDB before reporting success. Returning the
    // updated record also makes this path independent from the stale user
    // object that was loaded before the reset token was consumed.
    const updatedUser = await usersRepository.update(user.id, { passwordHash: hashPassword(password) })
    if (!updatedUser || !verifyPassword(password, updatedUser.passwordHash)) {
      const error = new Error('Não foi possível atualizar a palavra-passe. Tenta novamente.')
      error.statusCode = 500
      throw error
    }
    return updatedUser
  },
}
