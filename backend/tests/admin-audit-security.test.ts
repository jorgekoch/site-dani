import test from 'node:test'
import assert from 'node:assert/strict'

import { authService } from '../src/modules/auth/auth.service.js'
import { authRepository } from '../src/modules/auth/auth.repository.js'
import { requireRole } from '../src/middleware/requireAdminContext.js'
import { issueAdminToken, revokeAdminToken, verifyAdminToken } from '../src/lib/auth.js'

test('revoked tokens stop working after logout', () => {
  const token = issueAdminToken('admin-logout', 'ADMIN')

  assert.equal(verifyAdminToken(token)?.sub, 'admin-logout')

  revokeAdminToken(token)

  assert.equal(verifyAdminToken(token), null)
})

test('requires ADMIN role for privileged operations', () => {
  const staffReq = {} as any
  const res = { locals: { admin: { role: 'STAFF' } } } as any
  const next = () => undefined

  requireRole('ADMIN')(staffReq, res, next)

  assert.equal(typeof res.locals, 'object')
})

test('records an audit entry when creating an admin user', async () => {
  const originalCreateUser = authRepository.createUser
  const originalCreateAuditLog = authRepository.createAuditLog

  try {
    authRepository.createUser = async (data) => ({
      id: 'user-123',
      name: data.name,
      email: data.email,
      role: data.role,
      active: true,
    }) as any

    authRepository.createAuditLog = async (data) => {
      assert.equal(data.actorId, 'admin-1')
      assert.equal(data.action, 'ADMIN_USER_CREATED')
      assert.match(data.details ?? '', /Maria da Silva/i)
      return { id: 'audit-123' }
    }

    const result = await authService.createUser(
      {
        name: 'Maria da Silva',
        email: 'maria@teste.com',
        password: 'Senha@123',
        role: 'STAFF',
      },
      'admin-1',
    )

    assert.equal(result.id, 'user-123')
    assert.equal(result.name, 'Maria da Silva')
  } finally {
    authRepository.createUser = originalCreateUser
    authRepository.createAuditLog = originalCreateAuditLog
  }
})

test('records an audit entry when resetting a password', async () => {
  const originalFindUserById = authRepository.findUserById
  const originalUpdatePassword = authRepository.updatePassword
  const originalCreateAuditLog = authRepository.createAuditLog

  try {
    authRepository.findUserById = async () => ({
      id: 'user-456',
      name: 'Carlos',
      email: 'carlos@teste.com',
      role: 'STAFF',
      active: true,
    }) as any

    authRepository.updatePassword = async () => ({
      id: 'user-456',
      name: 'Carlos',
      email: 'carlos@teste.com',
      role: 'STAFF',
      active: true,
    }) as any

    authRepository.createAuditLog = async (data) => {
      assert.equal(data.actorId, 'admin-2')
      assert.equal(data.action, 'ADMIN_PASSWORD_RESET')
      assert.match(data.details ?? '', /Carlos/i)
      return { id: 'audit-456' }
    }

    await authService.resetPassword('user-456', 'NovaSenha@123', 'admin-2')
  } finally {
    authRepository.findUserById = originalFindUserById
    authRepository.updatePassword = originalUpdatePassword
    authRepository.createAuditLog = originalCreateAuditLog
  }
})
