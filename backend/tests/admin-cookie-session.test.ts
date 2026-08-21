import test from 'node:test'
import assert from 'node:assert/strict'

import { prisma } from '../src/lib/prisma.js'
import { extractAdminTokenFromRequest } from '../src/middleware/requireAdminContext.js'

test('reads the admin token from a cookie when Authorization header is absent', () => {
  const req = {
    header: (name: string) => {
      if (name.toLowerCase() === 'cookie') {
        return 'dani_admin_token=abc123.tokenxyz; other=value'
      }
      return undefined
    },
  } as any

  assert.equal(extractAdminTokenFromRequest(req), 'abc123.tokenxyz')
})

test('validates admin session by user id instead of email', async () => {
  const originalFindUnique = prisma.adminUser.findUnique

  try {
    prisma.adminUser.findUnique = async (args: any) => {
      assert.deepEqual(args.where, { id: 'user-42' })
      return {
        id: 'user-42',
        name: 'Alice',
        email: 'alice@site.com',
        role: 'ADMIN',
        active: true,
      }
    }

    const { issueAdminToken, verifyAdminToken } = await import('../src/lib/auth.js')
    const token = issueAdminToken('user-42', 'ADMIN')

    const req = {
      header: (name: string) => {
        if (name.toLowerCase() === 'authorization') {
          return `Bearer ${token}`
        }
        return undefined
      },
    } as any

    const res = { locals: {} } as any
    let nextCalled = false

    const next = () => {
      nextCalled = true
    }

    const verified = verifyAdminToken(token)
    assert.equal(verified?.sub, 'user-42')

    const { requireAdminContext } = await import('../src/middleware/requireAdminContext.js')
    await requireAdminContext(req, res, next)

    assert.equal(nextCalled, true)
    assert.equal(res.locals.admin.id, 'user-42')
  } finally {
    prisma.adminUser.findUnique = originalFindUnique
  }
})
