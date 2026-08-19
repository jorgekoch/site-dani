import { Router } from 'express'
import { issueAdminToken, safeEqual } from '../../lib/auth.js'
import { z } from 'zod'

export const authRouter = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
})

authRouter.post('/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Credenciais inválidas.' })
    return
  }

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    res.status(503).json({ message: 'A autenticação administrativa ainda não foi configurada.' })
    return
  }

  if (!safeEqual(parsed.data.email.toLowerCase(), adminEmail.toLowerCase()) || !safeEqual(parsed.data.password, adminPassword)) {
    res.status(401).json({ message: 'Credenciais inválidas.' })
    return
  }

  res.json({ token: issueAdminToken(adminEmail.toLowerCase()) })
})
