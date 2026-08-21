import test from 'node:test'
import assert from 'node:assert/strict'

import { triageService } from '../src/modules/triage/triage.service.js'
import { triageRepository } from '../src/modules/triage/triage.repository.js'

test('records an audit entry when viewing a triage record', async () => {
  const originalFindById = triageRepository.findById
  const originalCreateAuditLog = triageRepository.createAuditLog

  try {
    triageRepository.findById = async () => ({
      id: 'triage-1',
      fullName: 'Maria da Silva',
    }) as any

    triageRepository.createAuditLog = async (data) => {
      assert.equal(data.actorId, 'admin-1')
      assert.equal(data.triageId, 'triage-1')
      assert.match(data.action, /VIEW|READ/i)
      return { id: 'audit-read-1' }
    }

    const result = await triageService.getById('triage-1', 'admin-1')

    assert.deepEqual(result, {
      id: 'triage-1',
      fullName: 'Maria da Silva',
    })
  } finally {
    triageRepository.findById = originalFindById
    triageRepository.createAuditLog = originalCreateAuditLog
  }
})

test('allows an admin to trigger retention cleanup manually', async () => {
  const originalCleanupExpiredSubmissions = triageService.cleanupExpiredSubmissions

  try {
    triageService.cleanupExpiredSubmissions = async (retentionDays: number) => {
      assert.equal(retentionDays, 90)
      return {
        count: 3,
        retentionDays,
      }
    }

    const result = await triageService.cleanupExpiredSubmissions(90)

    assert.deepEqual(result, {
      count: 3,
      retentionDays: 90,
    })
  } finally {
    triageService.cleanupExpiredSubmissions = originalCleanupExpiredSubmissions
  }
})

test('anonymizes expired triage records after the retention period', async () => {
  const originalFindExpiredForRetention = triageRepository.findExpiredForRetention
  const originalAnonymizeExpired = triageRepository.anonymizeExpired

  try {
    triageRepository.findExpiredForRetention = async (cutoff: Date) => {
      assert.ok(cutoff instanceof Date)
      return [{ id: 'triage-old-1' }, { id: 'triage-old-2' }]
    }

    triageRepository.anonymizeExpired = async (ids: string[]) => {
      assert.deepEqual(ids, ['triage-old-1', 'triage-old-2'])
      return 2
    }

    const result = await triageService.cleanupExpiredSubmissions(30)

    assert.deepEqual(result, {
      count: 2,
      retentionDays: 30,
    })
  } finally {
    triageRepository.findExpiredForRetention = originalFindExpiredForRetention
    triageRepository.anonymizeExpired = originalAnonymizeExpired
  }
})

test('records an audit entry when updating internal notes', async () => {
  const originalFindById = triageRepository.findById
  const originalUpdateInternalNotesWithAudit =
    triageRepository.updateInternalNotesWithAudit

  try {
    triageRepository.findById = async () => ({ id: 'triage-1' }) as any

    triageRepository.updateInternalNotesWithAudit = async (
      id: string,
      internalNotes: string,
      actorId: string,
    ) => {
      assert.equal(id, 'triage-1')
      assert.equal(internalNotes, 'Nova observação interna')
      assert.equal(actorId, 'admin-1')

      return {
        id: 'triage-1',
        internalNotes,
      }
    }

    const result = await triageService.updateInternalNotes(
      'triage-1',
      'Nova observação interna',
      'admin-1',
    )

    assert.deepEqual(result, {
      id: 'triage-1',
      internalNotes: 'Nova observação interna',
    })
  } finally {
    triageRepository.findById = originalFindById
    triageRepository.updateInternalNotesWithAudit =
      originalUpdateInternalNotesWithAudit
  }
})
