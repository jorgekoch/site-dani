import { prisma } from '../../lib/prisma.js'
import { normalizeTextForStorage } from '../../core/utils/normalizeTextForStorage.js'
import type { TriageStatus } from '@prisma/client'
import type { TriageSubmissionInput } from './triage.schema.js'

export const triageRepository = {
  create(data: TriageSubmissionInput) {
    return prisma.triageSubmission.create({
      data,
      select: {
        id: true,
        status: true,
      },
    })
  },

  list(status?: TriageStatus) {
    return prisma.triageSubmission.findMany({
      where: {
        archivedAt: null,
        ...(status ? { status } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        status: true,
        fullName: true,
        age: true,
        profession: true,
        whatsapp: true,
        mainComplaint: true,
        painLocation: true,
        painLevel: true,
        treatmentReason: true,
        archivedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  },

  listArchived() {
    return prisma.triageSubmission.findMany({
      where: {
        archivedAt: {
          not: null,
        },
      },
      orderBy: {
        archivedAt: 'desc',
      },
      select: {
        id: true,
        status: true,
        fullName: true,
        age: true,
        profession: true,
        whatsapp: true,
        mainComplaint: true,
        painLocation: true,
        painLevel: true,
        treatmentReason: true,
        archivedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  },

  findArchiveStateById(id: string) {
    return prisma.triageSubmission.findUnique({
      where: { id },
      select: {
        id: true,
        archivedAt: true,
      },
    })
  },

  archiveWithAudit(id: string, actorId: string) {
    return prisma.$transaction(async (tx) => {
      const archivedAt = new Date()

      const updated = await tx.triageSubmission.update({
        where: { id },
        data: {
          archivedAt,
        },
      })

      await tx.auditLog.create({
        data: {
          actorId,
          triageId: updated.id,
          action: 'TRIAGE_ARCHIVED',
          details: 'Ficha arquivada',
        },
      })

      return updated
    })
  },

  restoreWithAudit(id: string, actorId: string) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.triageSubmission.update({
        where: { id },
        data: {
          archivedAt: null,
        },
      })

      await tx.auditLog.create({
        data: {
          actorId,
          triageId: updated.id,
          action: 'TRIAGE_RESTORED',
          details: 'Ficha restaurada do arquivo',
        },
      })

      return updated
    })
  },

  findById(id: string) {
    return prisma.triageSubmission.findUnique({
      where: { id },
      include: {
        auditLogs: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            actor: {
              select: {
                name: true,
                role: true,
              },
            },
          },
        },
      },
    })
  },

  createAuditLog(data: {
    action: string
    details?: string | null
    actorId: string
    triageId?: string | null
  }) {
    return prisma.auditLog.create({
      data,
    })
  },

  findStatusById(id: string) {
    return prisma.triageSubmission.findUnique({
      where: { id },
      select: {
        status: true,
      },
    })
  },

  updateInternalNotesWithAudit(
    id: string,
    internalNotes: string,
    actorId: string,
  ) {
    const normalizedInternalNotes = normalizeTextForStorage(
      internalNotes,
    )

    return prisma.$transaction(async (tx) => {
      const updated = await tx.triageSubmission.update({
        where: { id },
        data: {
          internalNotes: normalizedInternalNotes,
        },
      })

      await tx.auditLog.create({
        data: {
          actorId,
          triageId: updated.id,
          action: 'TRIAGE_INTERNAL_NOTES_UPDATED',
          details: 'Observação interna atualizada',
        },
      })

      return updated
    })
  },

  updateStatusWithAudit(
    id: string,
    status: TriageStatus,
    actorId: string,
    previousStatus: TriageStatus,
  ) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.triageSubmission.update({
        where: { id },
        data: {
          status,
        },
      })

      await tx.auditLog.create({
        data: {
          actorId,
          triageId: updated.id,
          action: 'TRIAGE_STATUS_CHANGED',
          details: `${previousStatus} -> ${status}`,
        },
      })

      return updated
    })
  },
}