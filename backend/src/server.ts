import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { ZodError } from 'zod'
import { authRouter } from './modules/auth/auth.routes.js'
import { getTriage, listTriage, triageRouter, updateTriageStatus } from './modules/triage/triage.routes.js'
import { requireAdminContext } from './middleware/requireAdminContext.js'

const app = express()
const port = Number(process.env.PORT ?? 4000)
const allowedOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173'

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: allowedOrigin }))
app.use(express.json({ limit: '100kb' }))

app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/triage', triageRouter)
app.use('/api/admin', (_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next() })
app.use('/api/admin/auth', authRouter)
app.get('/api/admin/triage', requireAdminContext, listTriage)
app.get('/api/admin/triage/:id', requireAdminContext, getTriage)
app.patch('/api/admin/triage/:id/status', requireAdminContext, updateTriageStatus)

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) { res.status(400).json({ message: 'Confira os campos da ficha e tente novamente.', fields: error.flatten().fieldErrors }); return }
  console.error('Unhandled API error')
  res.status(500).json({ message: 'Não foi possível concluir a operação.' })
})

app.listen(port, () => console.log(`API running on port ${port}`))
