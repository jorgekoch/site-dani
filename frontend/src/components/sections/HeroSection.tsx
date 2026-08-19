import { ArrowRight, Clock3, ShieldCheck } from 'lucide-react'

import './HeroSection.css'
import portrait from '../../assets/dani-transparente.png'
import { siteLinks } from '../../data/site'
import { useScrollTo } from '../../hooks/useScrollTo'

export function HeroSection() {
  const goTo = useScrollTo()

  return (
    <section className="hero" id="inicio">
      <div className="hero-noise" aria-hidden="true" />

      <div className="hero__image-side" aria-hidden="true">
        <div className="hero__image-wash" />
        <img
          className="hero__portrait"
          src={portrait}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero__image-caption">
          <span>Danielle Evangelista</span>
          <small>Fisioterapeuta</small>
        </div>
      </div>

      <div className="container hero__content-shell">
        <div className="hero__copy">
          <span className="eyebrow"><span /> Fisioterapia • Fazenda Rio Grande</span>
          <p className="hero-kicker">TRATAMENTO INDIVIDUALIZADO</p>
          <h1>Seu corpo fala.<br /><em>Eu escuto.</em></h1>
          <p className="hero-lead">Cuidado individualizado para aliviar dores, recuperar movimentos e devolver qualidade de vida.</p>

          <div className="hero-actions">
            <a className="button button-primary" href={siteLinks.whatsapp} target="_blank" rel="noreferrer">
              Agendar avaliação <ArrowRight size={18} />
            </a>
            <button className="button button-ghost" onClick={() => goTo('atendimento')}>
              Conheça o atendimento
            </button>
          </div>

          <div className="hero-trust">
            <div><ShieldCheck size={17} /><span>Atendimento individualizado</span></div>
            <div><Clock3 size={17} /><span>Sessões de ~50 min</span></div>
          </div>
        </div>
      </div>

      <div className="hero-side-note" aria-hidden="true">
        <span>01</span>
        <span>Escuta</span>
        <span>Movimento</span>
        <span>Cuidado</span>
      </div>

      <button className="scroll-cue" onClick={() => goTo('sobre')} aria-label="Conheça a Dani">
        <span /> role para conhecer
      </button>
    </section>
  )
}
