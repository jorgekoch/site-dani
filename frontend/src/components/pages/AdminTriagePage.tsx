import { useEffect, useState } from 'react'
import { adminLogout, getAdminToken, listAdminTriages, updateAdminTriageStatus } from '../../api/triageApi'
import './AdminPortal.css'

const statuses=['NEW','IN_REVIEW','ACCEPTED','DECLINED','COMPLETED'] as const
const labels:Record<string,string>={NEW:'Nova',IN_REVIEW:'Em análise',ACCEPTED:'Aprovada',DECLINED:'Recusada',COMPLETED:'Concluída'}
type Submission={id:string;fullName:string;age:number;profession:string;whatsapp:string;mainComplaint:string;painLocation:string;painLevel?:number;status:string;createdAt:string}

export function AdminTriagePage(){
 const [items,setItems]=useState<Submission[]>([]),[status,setStatus]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState('')
 async function load(){setLoading(true);setError('');try{setItems(await listAdminTriages(status))}catch(e){setError(e instanceof Error?e.message:'Erro ao carregar fichas.')}finally{setLoading(false)}}
 async function update(id:string,next:string){try{await updateAdminTriageStatus(id,next);await load()}catch(e){setError(e instanceof Error?e.message:'Não foi possível atualizar a ficha.')}}
 useEffect(()=>{if(!getAdminToken()){window.location.replace('/admin/login');return}load()},[status])
 return <main className="admin-page"><div className="admin-shell"><div className="admin-top"><div><span className="admin-eyebrow">Portal administrativo</span><h1>Triagens</h1></div><button onClick={()=>{adminLogout();window.location.replace('/admin/login')}}>Sair</button></div><div className="admin-filters"><button className={!status?'active':''} onClick={()=>setStatus('')}>Todas</button>{statuses.map(s=><button className={status===s?'active':''} key={s} onClick={()=>setStatus(s)}>{labels[s]}</button>)}</div>{loading?<p>Carregando fichas…</p>:error?<p className="admin-error">{error}</p>:items.length===0?<div className="admin-empty"><h2>Nenhuma ficha encontrada</h2><p>Quando um paciente enviar a avaliação, ela aparecerá aqui.</p></div>:<div className="triage-list">{items.map(item=><article className="triage-row" key={item.id}><div><span className="triage-status">{labels[item.status]??item.status}</span><h2>{item.fullName}</h2><p>{item.profession} · {item.age} anos · {item.whatsapp}</p><p>{item.mainComplaint}</p><small>{item.painLocation}{item.painLevel?` · dor ${item.painLevel}/10`:''} · {new Date(item.createdAt).toLocaleDateString('pt-BR')}</small></div><div className="triage-row-actions"><select value={item.status} onChange={e=>update(item.id,e.target.value)}>{statuses.map(s=><option key={s} value={s}>{labels[s]}</option>)}</select><a href={`/admin/triagens/${item.id}`}>Ver ficha</a></div></article>)}</div>}</div></main>
}
