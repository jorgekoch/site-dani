import { Clock3 } from 'lucide-react'

import clinic from '../../assets/consultorio.jpeg'
import { steps } from '../../data/site'

export function ProcessSection() {
  return (
    <section className="process section" id="atendimento">
      <div className="container">
        <div className="section-heading">
          <div><span className="section-kicker">02 — Como funciona</span><h2>Um atendimento pensado<br /><em>para o seu caso.</em></h2></div>
          <p>Antes de tratar, eu preciso entender. A avaliação é o ponto de partida para uma conduta mais precisa, segura e personalizada.</p>
        </div>

        <div className="steps">
          {steps.map((step) => (
            <article className="step" key={step.number}>
              <span className="step-number">{step.number}</span>
              <div><h3>{step.title}</h3><p>{step.text}</p></div>
            </article>
          ))}
        </div>

        <div className="process-feature">
          <div className="process-image"><img src={clinic} alt="Ambiente do consultório" /></div>
          <div className="process-content">
            <span className="eyebrow"><span /> Durante a sessão</span>
            <h3>Técnica, atenção<br />e <em>presença.</em></h3>
            <p>Conforme a sua necessidade, podem ser utilizadas técnicas de fisioterapia, quiropraxia, liberação miofascial, ventosaterapia, bota pneumática, auriculoterapia, laserterapia, entre outras abordagens.</p>
            <div className="duration"><Clock3 size={20} /><div><strong>Duração média de 50 minutos</strong><span>Uma sessão individual e sem pressa.</span></div></div>
          </div>
        </div>
      </div>
    </section>
  )
}
