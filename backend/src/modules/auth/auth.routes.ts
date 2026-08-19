import { Router } from 'express'
import { issueAdminToken, safeEqual } from '../../lib/auth.js'
import { z } from 'zod'

export const authRouter = Router()
const attempts = new Map<string, { count:number; resetAt:number }>()
const loginSchema = z.object({ email:z.string().email(), password:z.string().min(1).max(200) })

function isRateLimited(key:string){
  const now=Date.now(); const current=attempts.get(key)
  if(!current || current.resetAt<=now){attempts.set(key,{count:0,resetAt:now+15*60_000});return false}
  return current.count>=5
}
function registerFailure(key:string){const now=Date.now();const current=attempts.get(key);if(!current||current.resetAt<=now){attempts.set(key,{count:1,resetAt:now+15*60_000});return}current.count+=1}
function clearFailures(key:string){attempts.delete(key)}

authRouter.post('/login',(req,res)=>{
  const parsed=loginSchema.safeParse(req.body)
  if(!parsed.success){res.status(400).json({message:'Credenciais inválidas.'});return}
  const key=`${req.ip ?? 'unknown'}:${parsed.data.email.toLowerCase()}`
  if(isRateLimited(key)){res.status(429).json({message:'Muitas tentativas. Aguarde alguns minutos e tente novamente.'});return}
  const adminEmail=process.env.ADMIN_EMAIL, adminPassword=process.env.ADMIN_PASSWORD
  if(!adminEmail||!adminPassword){res.status(503).json({message:'A autenticação administrativa ainda não foi configurada.'});return}
  const valid=safeEqual(parsed.data.email.toLowerCase(),adminEmail.toLowerCase())&&safeEqual(parsed.data.password,adminPassword)
  if(!valid){registerFailure(key);res.status(401).json({message:'Credenciais inválidas.'});return}
  clearFailures(key);res.json({token:issueAdminToken(adminEmail.toLowerCase())})
})
