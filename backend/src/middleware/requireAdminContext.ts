import { NextFunction, Request, Response } from 'express'
import { verifyAdminToken, AdminRole } from '../lib/auth.js'

export function requireAdminContext(_req: Request, res: Response, next: NextFunction) {
  const header = _req.header('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  const admin = token ? verifyAdminToken(token) : null
  if (!admin) { res.status(401).json({ message: 'Não autorizado.' }); return }
  res.locals.admin = admin
  next()
}

export function requireRole(...roles: AdminRole[]) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const admin = res.locals.admin as { role: AdminRole } | undefined
    if (!admin || !roles.includes(admin.role)) { res.status(403).json({ message: 'Você não tem permissão para esta ação.' }); return }
    next()
  }
}
