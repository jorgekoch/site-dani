import { FormEvent, useState } from 'react'
import { adminLogin } from '../../api/triageApi'
import './AdminPortal.css'

export function AdminLoginPage() {
  const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[loading,setLoading]=useState(false)
  async function submit(e:FormEvent){e.preventDefault();setLoading(true);setError('');try{await adminLogin(email,password);window.location.assign('/admin/triagens')}catch(err){setError(err instanceof Error?err.message:'Não foi possível entrar.')}finally{setLoading(false)}}
  return <main className="admin-page"><section className="admin-card"><span className="admin-eyebrow">Dani Evangelista · Portal</span><h1>Acesso administrativo</h1><p>Entre para consultar e acompanhar as fichas de triagem.</p><form onSubmit={submit}><label>E-mail<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Senha<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p className="admin-error" role="alert">{error}</p>}<button disabled={loading}>{loading?'Entrando…':'Entrar no portal'}</button></form></section></main>
}
