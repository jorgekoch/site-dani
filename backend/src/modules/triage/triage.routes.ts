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
  '/:id',
  requireAdminContext,
  triageController.get,
)

triageRouter.post(
  '/cleanup-retention',
  requireAdminContext,
  requireRole('ADMIN'),
  triageController.cleanupRetention,
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