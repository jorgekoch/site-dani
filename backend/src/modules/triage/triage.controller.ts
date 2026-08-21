import { Request, Response } from 'express'

import {
  BadRequestError,
  UnauthorizedError,
} from '../../core/errors/AppError.js'
import { asyncHandler } from '../../core/utils/asyncHandler.js'
import {
  triageInternalNotesSchema,
  triageStatusSchema,
  triageStatusUpdateSchema,
  triageSubmissionSchema,
} from './triage.schema.js'
import { triageService } from './triage.service.js'

export const triageController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const input = triageSubmissionSchema.parse(req.body)

    const submission = await triageService.create(input)

    res.status(201).json({
      id: submission.id,
      status: submission.status,
      message: 'Ficha recebida com sucesso.',
    })
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const status =
      typeof req.query.status === 'string'
        ? triageStatusSchema.parse(req.query.status)
        : undefined

    const submissions = await triageService.list(status)

    res.json(submissions)
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    if (typeof id !== 'string' || !id) {
      throw new BadRequestError(
        'Identificador da ficha inválido.',
      )
    }

    const actor = res.locals.admin as
      | { id: string }
      | undefined

    if (!actor) {
      throw new UnauthorizedError('Não autorizado.')
    }

    const submission = await triageService.getById(id, actor.id)

    res.json(submission)
  }),

  cleanupRetention: asyncHandler(async (_req: Request, res: Response) => {
    const retentionDays = Number(process.env.DATA_RETENTION_DAYS ?? 90)

    const result = await triageService.cleanupExpiredSubmissions(retentionDays)

    res.json({
      message: 'Limpeza de retenção concluída.',
      ...result,
    })
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    if (typeof id !== 'string' || !id) {
      throw new BadRequestError(
        'Identificador da ficha inválido.',
      )
    }

    const { status } = triageStatusUpdateSchema.parse(req.body)

    const actor = res.locals.admin as
      | { id: string }
      | undefined

    if (!actor) {
      throw new UnauthorizedError('Não autorizado.')
    }

    const submission = await triageService.updateStatus(
      id,
      status,
      actor.id,
    )

    res.json(submission)
  }),

  updateInternalNotes: asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params

      if (typeof id !== 'string' || !id) {
        throw new BadRequestError(
          'Identificador da ficha inválido.',
        )
      }

      const { internalNotes } =
        triageInternalNotesSchema.parse(req.body)

      const actor = res.locals.admin as
        | { id: string }
        | undefined

      if (!actor) {
        throw new UnauthorizedError('Não autorizado.')
      }

      const submission =
        await triageService.updateInternalNotes(
          id,
          internalNotes,
          actor.id,
        )

      res.json(submission)
    },
  ),
}