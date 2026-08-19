import { ArrowRight, Clock3, MoveUpRight, ShieldCheck } from 'lucide-react'

import logo from '../../assets/dani-logo-horizontal-transparente.png'
import portrait from '../../assets/dani-transparente.png'
import { siteLinks } from '../../data/site'
import { useScrollTo } from '../../hooks/useScrollTo'

export function HeroSection() {
  const goTo = useScrollTo()

  return (
    <section className="hero" id="inicio">
      <div className="hero-noise" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow"><span /> Fisioterapia • Fazenda Rio Grande</span>
          <h1>Seu corpo fala.<br /><em>Eu escuto.</em></h1>
          <p className="hero-lead">Cuidado individualizado para aliviar dores, recuperar movimentos e devolver qualidade de vida.</p>
          <div className="hero-actions">
            <a className="button button-primary" href={siteLinks.whatsapp} target="_blank" rel="noreferrer">Agendar avaliação <ArrowRight size={18} /></a>
            <button className="button button-ghost" onClick={() => goTo('atendimento')}>Conheça o atendimento <MoveUpRight size={17} /></button>
          </div>
          <div className="hero-trust">
            <div><ShieldCheck size={17} /><span>Atendimento individualizado</span></div>
            <div><Clock3 size={17} /><span>Sessões de ~50 min</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-glow" />
          <div className="hero-circle">{logo && <img src={portrait} alt="Danielle Evangelista" />}</div>
          <div className="hero-badge"><span>Especialista em</span><strong>Coluna vertebral</strong></div>
          <div className="hero-mark">DE</div>
        </div>
      </div>
      <button className="scroll-cue" onClick={() => goTo('sobre')} aria-label="Conheça a Dani"><span /> role para conhecer</button>
    </section>
  )
}
