import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
const statuses = ['NEW', 'IN_REVIEW', 'ACCEPTED', 'DECLINED', 'COMPLETED'] as const

type Submission = { id:string; fullName:string; age:number; profession:string; whatsapp:string; mainComplaint:string; painLocation:string; painLevel:number; status:string; createdAt:string }

export function AdminTriagePage() {
  const [items,setItems] = useState<Submission[]>([]); const [status,setStatus] = useState(''); const [loading,setLoading]=useState(true); const [error,setError]=useState('')
  async function load(){setLoading(true);try{const token=localStorage.getItem('dani_admin_token');const url=`${API_URL}/api/admin/triage${status?`?status=${status}`:''}`;const r=await fetch(url,{headers:{Authorization:`Bearer ${token}`}});if(!r.ok)throw new Error('Não foi possível carregar as fichas.');setItems(await r.json())}catch(e){setError(e instanceof Error?e.message:'Erro ao carregar fichas.')}finally{setLoading(false)}}
  async function update(id:string,next:string){const token=localStorage.getItem('dani_admin_token');await fetch(`${API_URL}/api/admin/triage/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({status:next})});load()}
  useEffect(()=>{load()},[status])
  return <main style={{minHeight:'100vh',background:'#08080a',color:'#f1eee9',padding:'100px 24px'}}><div style={{maxWidth:1100,margin:'0 auto'}}><p style={{letterSpacing:'.18em',fontSize:10,color:'#aaa39d'}}>PORTAL ADMINISTRATIVO</p><h1 style={{fontSize:'clamp(42px,6vw,72px)',letterSpacing:'-.06em'}}>Triagens</h1><div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'30px 0'}}><button onClick={()=>setStatus('')} >Todas</button>{statuses.map(s=><button key={s} onClick={()=>setStatus(s)}>{s}</button>)}</div>{loading?<p>Carregando…</p>:error?<p>{error}</p>:<div style={{display:'grid',gap:12}}>{items.map(item=><article key={item.id} style={{border:'1px solid rgba(255,255,255,.1)',padding:20,background:'#101013'}}><div style={{display:'flex',justifyContent:'space-between',gap:15,flexWrap:'wrap'}}><div><strong>{item.fullName}</strong><p>{item.profession} · {item.age} anos · {item.whatsapp}</p><p>{item.mainComplaint}</p><small>{item.painLocation} · dor {item.painLevel}/10</small></div><select value={item.status} onChange={e=>update(item.id,e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></div></article>)}</div>}</div></main>
}
