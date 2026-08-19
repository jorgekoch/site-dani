const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export type TriageSubmission = {
  fullName: string
  age: number
  profession: string
  whatsapp: string
  careReason: 'RECOVERY' | 'MAINTENANCE'
  injuryDescription?: string
  injuryDuration?: string
  medicalReferral: boolean
  medicalDiagnosis?: string
  mainComplaint: string
  painLocation: string
  painRadiation?: string
  painLevel: number
  physicalActivity: boolean
  physicalActivityType?: string
  sportsInjuries: boolean
  sportsInjuriesDescription?: string
  complementaryExams: boolean
  complementaryExamsDescription?: string
  surgery: boolean
  surgeryDescription?: string
  metallicImplant: boolean
  metallicImplantLocation?: string
  medication: boolean
  medicationDescription?: string
  healthConditions: string[]
}

export async function submitTriage(data: TriageSubmission) {
  const response = await fetch(`${API_URL}/api/triage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message ?? 'Não foi possível enviar a ficha.')
  return payload
}
