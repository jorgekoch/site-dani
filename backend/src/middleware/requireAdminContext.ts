import { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { verifyAdminToken, AdminRole } from '../lib/auth.js'
import {
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from '../core/errors/AppError.js'

export function extractAdminTokenFromRequest(req: Request) {
  const header = req.header('authorization')
  const bearerToken = header?.startsWith('Bearer ')
    ? header.slice(7)
    : null

  if (bearerToken) {
    return bearerToken
  }

  const cookieHeader = req.header('cookie')
  if (!cookieHeader) {
    return null
  }

  const cookie = cookieHeader
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith('dani_admin_token='))

  if (!cookie) {
    return null
  }

  const rawValue = cookie.slice('dani_admin_token='.length)
  return rawValue ? decodeURIComponent(rawValue) : null
}

export async function requireAdminContext(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = extractAdminTokenFromRequest(req)

  const admin = token ? verifyAdminToken(token) : null

  if (!admin) {
    next(new UnauthorizedError('Não autorizado.'))
    return
  }

  try {
    const user = await prisma.adminUser.findUnique({
      where: {
        id: admin.sub,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    })

    if (!user || !user.active) {
      next(new UnauthorizedError('Usuário não autorizado.'))
      return
    }

    res.locals.admin = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'ADMIN_ACCESS_GRANTED',
        details: 'Acesso concedido ao portal administrativo',
      },
    }).catch(() => undefined)

    next()
  } catch {
    next(new InternalServerError('Não foi possível validar o acesso agora.'))
  }
}

export function requireRole(...roles: AdminRole[]) {
  return (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const admin = res.locals.admin as
      | { role: AdminRole }
      | undefined

    if (!admin || !roles.includes(admin.role)) {
      next(new ForbiddenError('Você não tem permissão para esta ação.'))
      return
    }

    next()
  }
}