import { jest } from '@jest/globals'

import {
  BadRequestError,
  NotFoundError,
} from '../../src/core/errors/AppError.js'

import { triageRepository } from '../../src/modules/triage/triage.repository.js'
import { triageService } from '../../src/modules/triage/triage.service.js'

describe('triageService - arquivamento', () => {
  const triageId = 'triage-123'
  const actorId = 'admin-123'

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('listArchived', () => {
    it('deve retornar as fichas arquivadas pelo repository', async () => {
      const archivedAt = new Date('2026-08-21T12:00:00.000Z')

      const archivedItems = [
        {
          id: triageId,
          status: 'COMPLETED',
          fullName: 'Maria da Rosa',
          age: 35,
          profession: 'Professora',
          whatsapp: '41999999999',
          mainComplaint: 'Dor lombar',
          painLocation: 'Lombar',
          painLevel: 5,
          treatmentReason: 'INJURY_RECOVERY',
          archivedAt,
          createdAt: new Date('2026-08-01T12:00:00.000Z'),
          updatedAt: new Date('2026-08-21T12:00:00.000Z'),
        },
      ]

      const listArchivedSpy = jest
        .spyOn(triageRepository, 'listArchived')
        .mockResolvedValue(archivedItems as never)

      const result = await triageService.listArchived()

      expect(listArchivedSpy).toHaveBeenCalledTimes(1)
      expect(result).toEqual(archivedItems)
    })
  })

  describe('archive', () => {
    it('deve arquivar uma ficha ativa', async () => {
      const archivedAt = new Date('2026-08-21T12:00:00.000Z')

      const findSpy = jest
        .spyOn(triageRepository, 'findArchiveStateById')
        .mockResolvedValue({
          id: triageId,
          archivedAt: null,
        })

      const archiveSpy = jest
        .spyOn(triageRepository, 'archiveWithAudit')
        .mockResolvedValue({
          id: triageId,
          archivedAt,
        } as never)

      const result = await triageService.archive(
        triageId,
        actorId,
      )

      expect(findSpy).toHaveBeenCalledTimes(1)
      expect(findSpy).toHaveBeenCalledWith(triageId)

      expect(archiveSpy).toHaveBeenCalledTimes(1)
      expect(archiveSpy).toHaveBeenCalledWith(
        triageId,
        actorId,
      )

      expect(result).toEqual(
        expect.objectContaining({
          id: triageId,
          archivedAt,
        }),
      )
    })

    it('deve lançar NotFoundError quando a ficha não existir', async () => {
      jest
        .spyOn(triageRepository, 'findArchiveStateById')
        .mockResolvedValue(null)

      const archiveSpy = jest.spyOn(
        triageRepository,
        'archiveWithAudit',
      )

      await expect(
        triageService.archive(triageId, actorId),
      ).rejects.toBeInstanceOf(NotFoundError)

      expect(archiveSpy).not.toHaveBeenCalled()
    })

    it('deve rejeitar uma ficha que já está arquivada', async () => {
      jest
        .spyOn(triageRepository, 'findArchiveStateById')
        .mockResolvedValue({
          id: triageId,
          archivedAt: new Date(
            '2026-08-20T12:00:00.000Z',
          ),
        })

      const archiveSpy = jest.spyOn(
        triageRepository,
        'archiveWithAudit',
      )

      await expect(
        triageService.archive(triageId, actorId),
      ).rejects.toBeInstanceOf(BadRequestError)

      expect(archiveSpy).not.toHaveBeenCalled()
    })
  })

  describe('restore', () => {
    it('deve restaurar uma ficha arquivada', async () => {
      const findSpy = jest
        .spyOn(triageRepository, 'findArchiveStateById')
        .mockResolvedValue({
          id: triageId,
          archivedAt: new Date(
            '2026-08-20T12:00:00.000Z',
          ),
        })

      const restoreSpy = jest
        .spyOn(triageRepository, 'restoreWithAudit')
        .mockResolvedValue({
          id: triageId,
          archivedAt: null,
        } as never)

      const result = await triageService.restore(
        triageId,
        actorId,
      )

      expect(findSpy).toHaveBeenCalledTimes(1)
      expect(findSpy).toHaveBeenCalledWith(triageId)

      expect(restoreSpy).toHaveBeenCalledTimes(1)
      expect(restoreSpy).toHaveBeenCalledWith(
        triageId,
        actorId,
      )

      expect(result).toEqual(
        expect.objectContaining({
          id: triageId,
          archivedAt: null,
        }),
      )
    })

    it('deve lançar NotFoundError quando a ficha não existir', async () => {
      jest
        .spyOn(triageRepository, 'findArchiveStateById')
        .mockResolvedValue(null)

      const restoreSpy = jest.spyOn(
        triageRepository,
        'restoreWithAudit',
      )

      await expect(
        triageService.restore(triageId, actorId),
      ).rejects.toBeInstanceOf(NotFoundError)

      expect(restoreSpy).not.toHaveBeenCalled()
    })

    it('deve rejeitar restauração de uma ficha que não está arquivada', async () => {
      jest
        .spyOn(triageRepository, 'findArchiveStateById')
        .mockResolvedValue({
          id: triageId,
          archivedAt: null,
        })

      const restoreSpy = jest.spyOn(
        triageRepository,
        'restoreWithAudit',
      )

      await expect(
        triageService.restore(triageId, actorId),
      ).rejects.toBeInstanceOf(BadRequestError)

      expect(restoreSpy).not.toHaveBeenCalled()
    })
  })
})