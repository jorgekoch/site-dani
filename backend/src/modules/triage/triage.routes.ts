import { Router } from 'express'
import {
  requireAdminContext,
  requireRole,
} from '../../middleware/requireAdminContext.js'
import { triageController } from './triage.controller.js'

export const triageRouter = Router()

triageRouter.post(
  '/',
  triageController.create,
)

triageRouter.get(
  '/',
  requireAdminContext,
  triageController.list,
)

triageRouter.get(
  '/archive',
  requireAdminContext,
  triageController.listArchived,
)

triageRouter.patch(
  '/:id/archive',
  requireAdminContext,
  requireRole('ADMIN'),
  triageController.archive,
)

triageRouter.patch(
  '/:id/restore',
  requireAdminContext,
  requireRole('ADMIN'),
  triageController.restore,
)

triageRouter.get(
  '/:id',
  requireAdminContext,
  triageController.get,
)

triageRouter.patch(
  '/:id/status',
  requireAdminContext,
  requireRole('ADMIN'),
  triageController.updateStatus,
)

triageRouter.patch(
  '/:id/internal-notes',
  requireAdminContext,
  requireRole('ADMIN'),
  triageController.updateInternalNotes,
)