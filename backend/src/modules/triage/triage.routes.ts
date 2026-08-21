import { Router } from 'express'
import { requireAdminContext } from '../../middleware/requireAdminContext.js'
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

triageRouter.patch(
  '/:id/status',
  requireAdminContext,
  triageController.updateStatus,
)

triageRouter.patch(
  '/:id/internal-notes',
  requireAdminContext,
  triageController.updateInternalNotes,
)