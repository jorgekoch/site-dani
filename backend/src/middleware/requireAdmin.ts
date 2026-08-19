import { NextFunction, Request, Response } from 'express'
import { verifyAdminToken } from '../lib/auth.js'

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null

  if (!token || !verifyAdminToken(token)) {
    res.status(401).json({ message: 'Não autorizado.' })
    return
  }

  next()
}
