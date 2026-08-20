import { Request, Response } from 'express'

import {
  BadRequestError,
  UnauthorizedError,
} from '../../core/errors/AppError.js'
import { asyncHandler } from '../../core/utils/asyncHandler.js'
import {
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

    const submission = await triageService.getById(id)

    res.json(submission)
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
      | { sub: string }
      | undefined

    if (!actor) {
      throw new UnauthorizedError('Não autorizado.')
    }

    const submission = await triageService.updateStatus(
      id,
      status,
      actor.sub,
    )

    res.json(submission)
  }),
}