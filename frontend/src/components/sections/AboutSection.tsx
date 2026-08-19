import { ArrowRight, Sparkles } from 'lucide-react'

import treating from '../../assets/dani-atendendo.jpeg'
import { siteLinks } from '../../data/site'

export function AboutSection() {
  return (
    <>
      <section className="intro section" id="sobre">
        <div className="container intro-grid">
          <div className="section-kicker">01 — Quem cuida de você</div>
          <div className="intro-copy">
            <p className="display-title">“Cada pessoa é única. Por isso, não sigo protocolos prontos — prefiro entender cada caso e tratar o que realmente importa: <strong>você.</strong>”</p>
            <p>Eu sou Danielle Evangelista, mas pode me chamar de “fisio”, “doutora”, “mãos de anjo” (ou de pedra), ou só “Dani”. Sou apaixonada pela minha profissão e acredito que um bom tratamento começa quando a gente realmente escuta o corpo.</p>
            <a className="text-link" href={siteLinks.whatsapp} target="_blank" rel="noreferrer">Quero conversar com a Dani <ArrowRight size={17} /></a>
          </div>
          <div className="intro-photo"><img src={treating} alt="Danielle realizando atendimento fisioterapêutico" /></div>
        </div>
      </section>

      <section className="manifesto">
        <div className="container manifesto-inner">
          <Sparkles size={22} />
          <p>Alívio da dor é importante.<br /><strong>Entender a causa é ainda mais.</strong></p>
        </div>
      </section>
    </>
  )
}
