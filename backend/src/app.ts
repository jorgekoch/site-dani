import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import { authRouter } from './modules/auth/auth.routes.js'
import {
  getTriage,
  listTriage,
  triageRouter,
  updateTriageStatus,
} from './modules/triage/triage.routes.js'
import { requireAdminContext } from './middleware/requireAdminContext.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

export const app = express()

const allowedOrigin =
  process.env.CORS_ORIGIN ?? 'http://localhost:5173'

app.disable('x-powered-by')

app.use(helmet())

app.use(
  cors({
    origin: allowedOrigin,
  }),
)

app.use(
  express.json({
    limit: '100kb',
  }),
)

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
  })
})

app.use('/api/triage', triageRouter)

app.use('/api/admin', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
})

app.use('/api/admin/auth', authRouter)

app.get(
  '/api/admin/triage',
  requireAdminContext,
  listTriage,
)

app.get(
  '/api/admin/triage/:id',
  requireAdminContext,
  getTriage,
)

app.patch(
  '/api/admin/triage/:id/status',
  requireAdminContext,
  updateTriageStatus,
)

app.use(notFound)

app.use(errorHandler)