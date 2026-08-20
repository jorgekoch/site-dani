import { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { verifyAdminToken, AdminRole } from '../lib/auth.js'

export async function requireAdminContext(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.header('authorization')
  const token = header?.startsWith('Bearer ')
    ? header.slice(7)
    : null

  const admin = token ? verifyAdminToken(token) : null

  if (!admin) {
    res.status(401).json({ message: 'Não autorizado.' })
    return
  }

  try {
    const user = await prisma.adminUser.findUnique({
      where: {
        email: admin.sub.toLowerCase(),
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
      res.status(401).json({
        message: 'Usuário não autorizado.',
      })
      return
    }

    res.locals.admin = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    next()
  } catch {
    res.status(503).json({
      message: 'Não foi possível validar o acesso agora.',
    })
  }
}

export function requireRole(...roles: AdminRole[]) {
  return (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const admin = res.locals.admin as
      | { role: AdminRole }
      | undefined

    if (
      !admin ||
      !roles.includes(admin.role)
    ) {
      res.status(403).json({
        message:
          'Você não tem permissão para esta ação.',
      })
      return
    }

    next()
  }
}