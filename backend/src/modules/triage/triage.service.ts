import {
  NotFoundError,
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

  async getById(id: string, actorId?: string) {
    const submission = await triageRepository.findById(id)

    if (!submission) {
      throw new NotFoundError(
        'Ficha não encontrada.',
      )
    }

    if (actorId) {
      await triageRepository.createAuditLog({
        actorId,
        triageId: submission.id,
        action: 'TRIAGE_VIEWED',
        details: 'Visualização da ficha de triagem',
      }).catch(() => undefined)
    }

    return submission
  },

  async cleanupExpiredSubmissions(retentionDays: number) {
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)
    const expired = await triageRepository.findExpiredForRetention(cutoff)
    const ids = expired.map((item) => item.id)
    const count = await triageRepository.anonymizeExpired(ids)

    return {
      count,
      retentionDays,
    }
  },

  async updateStatus(
    id: string,
    status: TriageStatus,
    actorId: string,
  ) {
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
      actorId,
      existing.status,
    )
  },

  async updateInternalNotes(
    id: string,
    internalNotes: string,
    actorId: string,
  ) {
    const existing = await triageRepository.findById(id)

    if (!existing) {
      throw new NotFoundError(
        'Ficha não encontrada.',
      )
    }

    return triageRepository.updateInternalNotesWithAudit(
      id,
      internalNotes,
      actorId,
    )
  },
}

