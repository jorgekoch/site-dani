import {
  BadRequestError,
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

  async listArchived() {
    return triageRepository.listArchived()
  },

  async archive(
    id: string,
    actorId: string,
  ) {
    const existing =
      await triageRepository.findArchiveStateById(id)

    if (!existing) {
      throw new NotFoundError(
        'Ficha não encontrada.',
      )
    }

    if (existing.archivedAt) {
      throw new BadRequestError(
        'Esta ficha já está arquivada.',
      )
    }

    return triageRepository.archiveWithAudit(
      id,
      actorId,
    )
  },

  async restore(
    id: string,
    actorId: string,
  ) {
    const existing =
      await triageRepository.findArchiveStateById(id)

    if (!existing) {
      throw new NotFoundError(
        'Ficha não encontrada.',
      )
    }

    if (!existing.archivedAt) {
      throw new BadRequestError(
        'Esta ficha não está arquivada.',
      )
    }

    return triageRepository.restoreWithAudit(
      id,
      actorId,
    )
  },
}

