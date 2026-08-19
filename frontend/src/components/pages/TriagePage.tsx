import { FormEvent, useState } from 'react'
import { submitTriage, TriageSubmission } from '../../api/triageApi'
import './TriagePage.css'

const conditions = [
  'Colesterol elevado', 'Diabético', 'Hipertenso', 'Cardiopata', 'Uso de marcapasso',
  'Tabagista', 'Trombose Venosa Profunda', 'Infecções ou doenças de pele',
  'Arritmia, descompensação e/ou insuficiência cardíaca', 'Gestante',
  'Qualquer tipo de câncer', 'Insuficiência renal/hepática', 'Nenhuma informação complementar',
]

const initialForm: TriageSubmission = {
  fullName: '', age: 0, profession: '', whatsapp: '', careReason: 'RECOVERY',
  injuryDescription: '', injuryDuration: '', medicalReferral: false, medicalDiagnosis: '',
  mainComplaint: '', painLocation: '', painRadiation: '', painLevel: 1,
  physicalActivity: false, physicalActivityType: '', sportsInjuries: false,
  sportsInjuriesDescription: '', complementaryExams: false, complementaryExamsDescription: '',
  surgery: false, surgeryDescription: '', metallicImplant: false, metallicImplantLocation: '',
  medication: false, medicationDescription: '', healthConditions: [],
}

export function TriagePage() {
  const [form, setForm] = useState<TriageSubmission>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const update = <K extends keyof TriageSubmission>(key: K, value: TriageSubmission[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const toggleCondition = (condition: string) => {
    const next = form.healthConditions.includes(condition)
      ? form.healthConditions.filter((item) => item !== condition)
      : [...form.healthConditions.filter((item) => item !== 'Nenhuma informação complementar'), condition]
    update('healthConditions', next)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true); setError('')
    try { await submitTriage(form); setSuccess(true) }
    catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível enviar a ficha.') }
    finally { setSubmitting(false) }
  }

  if (success) return <main className="triage-page"><section className="triage-success"><span className="triage-eyebrow">Ficha recebida</span><h1>Obrigado por preencher sua avaliação.</h1><p>Suas informações foram enviadas com segurança. A equipe irá analisar sua ficha e entrar em contato pelo WhatsApp para orientar os próximos passos.</p><a className="triage-button" href="https://wa.me/5541998837462">Falar pelo WhatsApp</a></section></main>

  return <main className="triage-page"><div className="triage-intro"><span className="triage-eyebrow">Ficha de avaliação</span><h1>Vamos entender melhor o que você precisa.</h1><p>Esta ficha de avaliação prévia nos ajuda a conhecer sua queixa e preparar um atendimento mais rápido e efetivo.</p><p><strong>Responda com sinceridade e, quando necessário, explique em detalhes.</strong> Se sua dor for muito intensa, entre em contato pelo WhatsApp após preencher a ficha.</p></div>
    <form className="triage-form" onSubmit={handleSubmit}>
      <fieldset><legend>Seus dados</legend><div className="triage-grid"><label>Nome completo *<input required value={form.fullName} onChange={e => update('fullName', e.target.value)} /></label><label>Idade *<input required type="number" min="1" value={form.age || ''} onChange={e => update('age', Number(e.target.value))} /></label><label>Profissão *<input required value={form.profession} onChange={e => update('profession', e.target.value)} /></label><label>WhatsApp *<input required value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} /></label></div></fieldset>
      <fieldset><legend>Sobre sua dor</legend><div className="triage-stack"><label>Seu atendimento será para *<select value={form.careReason} onChange={e => update('careReason', e.target.value as TriageSubmission['careReason'])}><option value="RECOVERY">Recuperação de lesão</option><option value="MAINTENANCE">Manutenção da saúde</option></select></label><label>Qual é sua queixa principal ou necessidade? *<textarea required value={form.mainComplaint} onChange={e => update('mainComplaint', e.target.value)} /></label><label>Qual é o local da dor/procedimento? *<input required value={form.painLocation} onChange={e => update('painLocation', e.target.value)} /></label><label>A dor irradia para outro lugar? Se sim, onde?<input value={form.painRadiation} onChange={e => update('painRadiation', e.target.value)} /></label><label>Nível da dor: <strong>{form.painLevel}/10</strong><input type="range" min="1" max="10" value={form.painLevel} onChange={e => update('painLevel', Number(e.target.value))} /></label><label>Se é por lesão, conte brevemente como aconteceu.<textarea value={form.injuryDescription} onChange={e => update('injuryDescription', e.target.value)} /></label><label>Há quanto tempo lida com essa lesão?<input value={form.injuryDuration} onChange={e => update('injuryDuration', e.target.value)} /></label></div></fieldset>
      <fieldset><legend>Histórico e condição atual</legend><div className="triage-stack">{[
        ['medicalReferral','Tem encaminhamento médico?'], ['physicalActivity','Realiza alguma atividade física?'], ['sportsInjuries','Já teve lesões no esporte?'], ['complementaryExams','Já realizou exames complementares?'], ['surgery','Fez alguma cirurgia?'], ['metallicImplant','Usa implante metálico?'], ['medication','Faz uso de medicamento?'],
      ].map(([key, label]) => <div className="triage-choice" key={key}><span>{label}</span><div><button type="button" className={form[key as keyof TriageSubmission] === true ? 'selected' : ''} onClick={() => update(key as keyof TriageSubmission, true as never)}>Sim</button><button type="button" className={form[key as keyof TriageSubmission] === false ? 'selected' : ''} onClick={() => update(key as keyof TriageSubmission, false as never)}>Não</button></div></div>)}
        {form.medicalReferral && <label>Qual é o diagnóstico médico?<input value={form.medicalDiagnosis} onChange={e => update('medicalDiagnosis', e.target.value)} /></label>}
        {form.physicalActivity && <label>Qual atividade física?<input value={form.physicalActivityType} onChange={e => update('physicalActivityType', e.target.value)} /></label>}
        {form.sportsInjuries && <label>Quais lesões?<textarea value={form.sportsInjuriesDescription} onChange={e => update('sportsInjuriesDescription', e.target.value)} /></label>}
        {form.complementaryExams && <label>Quais exames?<input value={form.complementaryExamsDescription} onChange={e => update('complementaryExamsDescription', e.target.value)} /></label>}
        {form.surgery && <label>Qual cirurgia?<input value={form.surgeryDescription} onChange={e => update('surgeryDescription', e.target.value)} /></label>}
        {form.metallicImplant && <label>Onde está o implante?<input value={form.metallicImplantLocation} onChange={e => update('metallicImplantLocation', e.target.value)} /></label>}
        {form.medication && <label>Qual medicamento?<input value={form.medicationDescription} onChange={e => update('medicationDescription', e.target.value)} /></label>}
      </div></fieldset>
      <fieldset><legend>Informações complementares de saúde</legend><div className="condition-list">{conditions.map(condition => <label key={condition}><input type="checkbox" checked={form.healthConditions.includes(condition)} onChange={() => toggleCondition(condition)} />{condition}</label>)}</div></fieldset>
      {error && <p className="triage-error" role="alert">{error}</p>}
      <button className="triage-submit" disabled={submitting}>{submitting ? 'Enviando ficha…' : 'Enviar ficha de avaliação'}</button>
    </form>
  </main>
}
