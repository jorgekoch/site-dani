import test from 'node:test'
import assert from 'node:assert/strict'

import { validateUserStatusChange } from '../src/modules/auth/auth.service.ts'

test('allows activating an inactive admin', () => {
  assert.doesNotThrow(() =>
    validateUserStatusChange({
      targetRole: 'ADMIN',
      nextActive: true,
      activeAdminsCount: 1,
    }),
  )
})

test('blocks deactivating the last active admin', () => {
  assert.throws(
    () =>
      validateUserStatusChange({
        targetRole: 'ADMIN',
        nextActive: false,
        activeAdminsCount: 1,
      }),
    /último administrador ativo/i,
  )
})

test('allows deactivating an admin when another admin remains active', () => {
  assert.doesNotThrow(() =>
    validateUserStatusChange({
      targetRole: 'ADMIN',
      nextActive: false,
      activeAdminsCount: 2,
    }),
  )
})
