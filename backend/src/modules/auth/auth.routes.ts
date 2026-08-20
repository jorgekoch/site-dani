import { Router } from 'express'

import { authController } from './auth.controller.js'
import {
  requireAdminContext,
  requireRole,
} from '../../middleware/requireAdminContext.js'

export const authRouter = Router()

authRouter.post(
  '/login',
  authController.login,
)

authRouter.get(
  '/me',
  requireAdminContext,
  authController.me,
)

authRouter.get(
  '/users',
  requireAdminContext,
  requireRole('ADMIN'),
  authController.listUsers,
)

authRouter.post(
  '/users',
  requireAdminContext,
  requireRole('ADMIN'),
  authController.createUser,
)

authRouter.patch(
  '/users/:id/password',
  requireAdminContext,
  requireRole('ADMIN'),
  authController.resetPassword,
)