import { NextFunction, Request, Response, Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { triageStatusSchema, triageStatusUpdateSchema, triageSubmissionSchema } from './triage.schema.js'

export const triageRouter = Router()

triageRouter.post('/', async (req, res, next) => {
  try {
    const input = triageSubmissionSchema.parse(req.body)
    const submission = await prisma.triageSubmission.create({ data: input })

    res.status(201).json({
      id: submission.id,
      status: submission.status,
      message: 'Ficha recebida com sucesso.',
    })
  } catch (error) {
    next(error)
  }
})

export async function listTriage(req: Request, res: Response, next: NextFunction) {
  try {
    const status = typeof req.query.status === 'string' ? triageStatusSchema.parse(req.query.status) : undefined
    const submissions = await prisma.triageSubmission.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    res.json(submissions)
  } catch (error) {
    next(error)
  }
}

export async function updateTriageStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = triageStatusUpdateSchema.parse(req.body)
    const submission = await prisma.triageSubmission.update({
      where: { id: req.params.id },
      data: { status },
    })
    res.json(submission)
  } catch (error) {
    next(error)
  }
}
