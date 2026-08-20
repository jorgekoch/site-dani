import {
  NotFoundError,
  UnauthorizedError,
} from '../../core/errors/AppError.js'
import type { TriageStatus } from '@prisma/client'
import { triageRepository } from './triage.repository.js'
import type {
  TriageSubmissionInput,
} from './triage.schema.js'

export const triageService = {
  async create(input: TriageSubmissionInput) {
    return triageRepository.create(input)
  },

  async list(status?: TriageStatus) {
    return triageRepository.list(status)
  },

  async getById(id: string) {
    const submission = await triageRepository.findById(id)

    if (!submission) {
      throw new NotFoundError(
        'Ficha não encontrada.',
      )
    }

    return submission
  },

  async updateStatus(
    id: string,
    status: TriageStatus,
    actorEmail: string,
  ) {
    const admin =
      await triageRepository.findAdminByEmail(actorEmail)

    if (!admin || !admin.active) {
      throw new UnauthorizedError(
        'Usuário administrativo não encontrado.',
      )
    }

    const existing =
      await triageRepository.findStatusById(id)

    if (!existing) {
      throw new NotFoundError(
        'Ficha não encontrada.',
      )
    }

    return triageRepository.updateStatusWithAudit(
      id,
      status,
      admin.id,
      existing.status,
    )
  },
}