import { ArrowRight } from 'lucide-react'
import './CtaSection.css'
import { siteLinks } from '../../data/site'

export function CtaSection() {
  return (
    <section className="cta">
      <div className="cta-glow" />
      <div className="container cta-inner">
        <span className="section-kicker">Seu próximo passo</span>
        <h2>Chega de conviver<br />com a <em>dor.</em></h2>
        <p>Vamos entender o que seu corpo está tentando dizer.</p>
        <a className="button button-light" href={siteLinks.whatsapp} target="_blank" rel="noreferrer">Falar com a equipe no WhatsApp <ArrowRight size={18} /></a>
        <a className="cta-triage-link" href="/triagem">Já fui orientado a preencher a ficha de avaliação</a>
      </div>
    </section>
  )
}
