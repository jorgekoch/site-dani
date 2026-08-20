import { prisma } from '../../lib/prisma.js'
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

  findAdminByEmail(email: string) {
    return prisma.adminUser.findUnique({
      where: { email },
      select: {
        id: true,
        active: true,
      },
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