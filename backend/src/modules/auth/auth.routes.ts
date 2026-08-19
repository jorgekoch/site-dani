import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { hashPassword, issueAdminToken, safeEqual, verifyPassword } from '../../lib/auth.js'
import { requireAdminContext, requireRole } from '../../middleware/requireAdminContext.js'
import { z } from 'zod'

export const authRouter = Router()
const attempts = new Map<string, { count:number; resetAt:number }>()
const loginSchema = z.object({ email:z.string().email(), password:z.string().min(1).max(200) })
const userSchema = z.object({ name:z.string().trim().min(2).max(120), email:z.string().email(), password:z.string().min(10).max(200), role:z.enum(['ADMIN','STAFF']) })

function isRateLimited(key:string){const now=Date.now();const current=attempts.get(key);if(!current||current.resetAt<=now){attempts.set(key,{count:0,resetAt:now+15*60_000});return false}return current.count>=5}
function registerFailure(key:string){const now=Date.now();const current=attempts.get(key);if(!current||current.resetAt<=now){attempts.set(key,{count:1,resetAt:now+15*60_000});return}current.count+=1}
function clearFailures(key:string){attempts.delete(key)}

authRouter.post('/login',async(req,res)=>{
  const parsed=loginSchema.safeParse(req.body); if(!parsed.success){res.status(400).json({message:'Credenciais inválidas.'});return}
  const email=parsed.data.email.toLowerCase(); const key=`${req.ip ?? 'unknown'}:${email}`
  if(isRateLimited(key)){res.status(429).json({message:'Muitas tentativas. Aguarde alguns minutos e tente novamente.'});return}
  try {
    let user=await prisma.adminUser.findUnique({where:{email}})
    const envEmail=process.env.ADMIN_EMAIL?.toLowerCase(); const envPassword=process.env.ADMIN_PASSWORD
    if(!user && envEmail===email && envPassword && safeEqual(parsed.data.password,envPassword)) user=await prisma.adminUser.create({data:{name:'Administrador',email,role:'ADMIN',passwordHash:hashPassword(envPassword)}})
    if(!user || !user.active || !verifyPassword(parsed.data.password,user.passwordHash)){registerFailure(key);res.status(401).json({message:'Credenciais inválidas.'});return}
    clearFailures(key);res.json({token:issueAdminToken(user.email,user.role),user:{id:user.id,name:user.name,email:user.email,role:user.role}})
  } catch { res.status(503).json({message:'Não foi possível autenticar agora.'}) }
})

authRouter.get('/me',requireAdminContext,async(_req,res)=>res.json({admin:res.locals.admin}))
authRouter.get('/users',requireAdminContext,requireRole('ADMIN'),async(_req,res)=>{const users=await prisma.adminUser.findMany({orderBy:{createdAt:'asc'},select:{id:true,name:true,email:true,role:true,active:true,createdAt:true}});res.json(users)})
authRouter.post('/users',requireAdminContext,requireRole('ADMIN'),async(req,res)=>{const parsed=userSchema.safeParse(req.body);if(!parsed.success){res.status(400).json({message:'Confira os dados do usuário.'});return}try{const user=await prisma.adminUser.create({data:{...parsed.data,passwordHash:hashPassword(parsed.data.password)}});res.status(201).json({id:user.id,name:user.name,email:user.email,role:user.role,active:user.active})}catch{res.status(409).json({message:'Este e-mail já está cadastrado.'})}})
