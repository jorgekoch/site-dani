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
        <a className="button button-light" href={siteLinks.whatsapp} target="_blank" rel="noreferrer">Agendar minha avaliação <ArrowRight size={18} /></a>
      </div>
    </section>
  )
}
