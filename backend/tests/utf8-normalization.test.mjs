import test from 'node:test'
import assert from 'node:assert/strict'

import { normalizeTextForStorage } from '../src/core/utils/normalizeTextForStorage.ts'

test('preserves valid accented text', () => {
  assert.equal(
    normalizeTextForStorage('Observação interna de teste da equipe.'),
    'Observação interna de teste da equipe.',
  )
})

test('removes replacement characters from corrupted utf-8 strings', () => {
  assert.equal(
    normalizeTextForStorage('Observa��o interna de teste da equipe.'),
    'Observao interna de teste da equipe.',
  )
})
