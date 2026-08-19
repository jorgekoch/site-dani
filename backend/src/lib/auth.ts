import jwt from 'jsonwebtoken'
import { timingSafeEqual } from 'node:crypto'

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET is required')
}

export type AdminToken = {
  sub: string
  role: 'ADMIN'
}

export function issueAdminToken(subject: string) {
  return jwt.sign({ sub: subject, role: 'ADMIN' }, jwtSecret, { expiresIn: '8h' })
}

export function verifyAdminToken(token: string): AdminToken | null {
  try {
    const payload = jwt.verify(token, jwtSecret) as jwt.JwtPayload
    if (payload.role !== 'ADMIN' || typeof payload.sub !== 'string') return null
    return { sub: payload.sub, role: 'ADMIN' }
  } catch {
    return null
  }
}

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}
