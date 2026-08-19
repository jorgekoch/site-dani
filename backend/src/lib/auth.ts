import jwt from 'jsonwebtoken'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is required')
  return secret
}

export type AdminRole = 'ADMIN' | 'STAFF'
export type AdminToken = { sub: string; role: AdminRole }

export function issueAdminToken(subject: string, role: AdminRole) {
  return jwt.sign({ sub: subject, role }, getJwtSecret(), { expiresIn: '8h' })
}

export function verifyAdminToken(token: string): AdminToken | null {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload
    if ((payload.role !== 'ADMIN' && payload.role !== 'STAFF') || typeof payload.sub !== 'string') return null
    return { sub: payload.sub, role: payload.role }
  } catch { return null }
}

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left); const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(':')
  if (!salt || !expected) return false
  const actual = scryptSync(password, salt, 64)
  const expectedBuffer = Buffer.from(expected, 'hex')
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer)
}
