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
      where: status ? { status } : undefined,
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
        createdAt: true,
        updatedAt: true,
      },
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

  findExpiredForRetention(cutoff: Date) {
    return prisma.triageSubmission.findMany({
      where: {
        createdAt: {
          lt: cutoff,
        },
      },
      select: {
        id: true,
      },
    })
  },

  anonymizeExpired(ids: string[]) {
    if (ids.length === 0) {
      return 0
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.triageSubmission.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          fullName: 'Dado removido',
          whatsapp: '00000000000',
          age: 0,
          profession: 'Dados removidos',
          medicalDiagnosis: null,
          mainComplaint: 'Dados removidos por retenção',
          painLocation: 'Dados removidos por retenção',
          painRadiatesWhere: null,
          painLevel: null,
          injuryDescription: null,
          injuryDuration: null,
          physicalActivityType: null,
          sportsInjuryDetails: null,
          complementaryExamsDetails: null,
          surgeryDetails: null,
          metalImplantLocation: null,
          medicationDetails: null,
          healthConditions: ['Dados removidos'],
          additionalHealthInfo: null,
          internalNotes: 'Dados removidos por retenção',
          consentAccepted: false,
        },
      })

      return updated.count
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