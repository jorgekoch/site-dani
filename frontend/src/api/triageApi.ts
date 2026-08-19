const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export type TriageSubmission = {
  fullName: string; age: number; profession: string; whatsapp: string
  treatmentReason: 'INJURY_RECOVERY' | 'HEALTH_MAINTENANCE'
  injuryDescription?: string; injuryDuration?: string; medicalReferral: boolean; medicalDiagnosis?: string
  mainComplaint: string; painLocation: string; painRadiates?: boolean; painRadiatesWhere?: string; painLevel?: number
  physicalActivity: boolean; physicalActivityType?: string; sportsInjury?: boolean; sportsInjuryDetails?: string
  complementaryExams: boolean; complementaryExamsDetails?: string; surgery: boolean; surgeryDetails?: string
  metalImplant: boolean; metalImplantLocation?: string; medication: boolean; medicationDetails?: string
  healthConditions: string[]; additionalHealthInfo?: string; consentAccepted: true
}

export async function submitTriage(data: TriageSubmission) {
  const response = await fetch(`${API_URL}/api/triage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message ?? 'Não foi possível enviar a ficha.')
  return payload
}

export async function adminLogin(email: string, password: string) {
  const response = await fetch(`${API_URL}/api/admin/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message ?? 'Credenciais inválidas.')
  localStorage.setItem('dani_admin_token', payload.token)
  return payload
}

export function adminLogout() { localStorage.removeItem('dani_admin_token') }
export function getAdminToken() { return localStorage.getItem('dani_admin_token') }

async function adminRequest(path: string, options: RequestInit = {}) {
  const token = getAdminToken()
  if (!token) throw new Error('Faça login para acessar o portal.')
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}), Authorization: `Bearer ${token}` } })
  const payload = await response.json().catch(() => null)
  if (response.status === 401) { adminLogout(); throw new Error('Sua sessão expirou. Faça login novamente.') }
  if (!response.ok) throw new Error(payload?.message ?? 'Não foi possível concluir a operação.')
  return payload
}

export const listAdminTriages = (status?: string) => adminRequest(`/api/admin/triage${status ? `?status=${encodeURIComponent(status)}` : ''}`)
export const getAdminTriage = (id: string) => adminRequest(`/api/admin/triage/${id}`)
export const updateAdminTriageStatus = (id: string, status: string) => adminRequest(`/api/admin/triage/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
