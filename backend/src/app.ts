import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import { authRouter } from './modules/auth/auth.routes.js'
import { triageRouter } from './modules/triage/triage.routes.js'
import { requireAdminContext } from './middleware/requireAdminContext.js'
import { notFound } from './core/middleware/notFound.js'
import { errorHandler } from './core/middleware/errorHandler.js'

export const app = express()

const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.disable('x-powered-by')

app.use(helmet())

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true)
        return
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Origin not allowed by CORS'))
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
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

app.use('/api/admin/triage', triageRouter)

app.use(notFound)

app.use(errorHandler)