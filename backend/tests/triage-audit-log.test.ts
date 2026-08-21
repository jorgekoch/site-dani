import test from 'node:test'
import assert from 'node:assert/strict'

import { triageService } from '../src/modules/triage/triage.service.js'
import { triageRepository } from '../src/modules/triage/triage.repository.js'

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
