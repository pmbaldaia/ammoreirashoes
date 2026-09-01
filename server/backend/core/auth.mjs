import crypto from 'node:crypto'

const secret = process.env.AUTH_SECRET || 'am-moreira-dev-change-this-secret'
const ttlSeconds = Number(process.env.AUTH_TTL_SECONDS || 60 * 60 * 8)

const b64 = (value) => Buffer.from(value).toString('base64url')
const unb64 = (value) => Buffer.from(value, 'base64url').toString('utf8')
const sign = (value) => crypto.createHmac('sha256', secret).update(value).digest('base64url')

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex')
  return `${salt}:${hash}`
}
export function verifyPassword(password, stored = '') {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const candidate = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex')
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash))
}
export function createToken(user) {
  const payload = b64(JSON.stringify({ sub: user.id, email: user.email, name: user.name, role: user.role, exp: Math.floor(Date.now()/1000)+ttlSeconds }))
  return `${payload}.${sign(payload)}`
}
export function verifyToken(token = '') {
  const [payload, signature] = token.split('.')
  if (!payload || !signature || sign(payload) !== signature) return null
  try {
    const data = JSON.parse(unb64(payload))
    if (!data.exp || data.exp < Math.floor(Date.now()/1000)) return null
    return data
  } catch { return null }
}
export function bearer(req) {
  const value = req.headers.authorization || ''
  return value.startsWith('Bearer ') ? value.slice(7) : ''
}
