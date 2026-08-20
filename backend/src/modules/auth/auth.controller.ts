import { Request, Response } from 'express'

import { BadRequestError } from '../../core/errors/AppError.js'
import { asyncHandler } from '../../core/utils/asyncHandler.js'
import { authService } from './auth.service.js'
import {
  createUserSchema,
  loginSchema,
  resetPasswordSchema,
} from './auth.schema.js'

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const input = loginSchema.parse(req.body)

    const rateLimitKey =
      `${req.ip ?? 'unknown'}:${input.email.toLowerCase()}`

    const result = await authService.login(
      input,
      rateLimitKey,
    )

    res.json(result)
  }),

  me: asyncHandler(async (_req: Request, res: Response) => {
    res.json({
      admin: res.locals.admin,
    })
  }),

  listUsers: asyncHandler(async (_req: Request, res: Response) => {
    const users = await authService.listUsers()

    res.json(users)
  }),

  createUser: asyncHandler(async (req: Request, res: Response) => {
    const input = createUserSchema.parse(req.body)

    const user = await authService.createUser(input)

    res.status(201).json(user)
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    if (typeof id !== 'string' || !id.trim()) {
      throw new BadRequestError('Usuário inválido.')
    }

    const input = resetPasswordSchema.parse(req.body)

    const user = await authService.resetPassword(
      id,
      input.password,
    )

    res.json({
      message: 'Senha redefinida com sucesso.',
      user,
    })
  }),
}