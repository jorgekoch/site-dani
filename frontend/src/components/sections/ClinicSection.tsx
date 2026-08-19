import { MapPin, MoveUpRight } from 'lucide-react'

import clinic from '../../assets/consultorio.jpeg'
import { siteLinks } from '../../data/site'

export function ClinicSection() {
  return (
    <section className="clinic section" id="consultorio">
      <div className="container">
        <div className="clinic-heading"><span className="section-kicker">05 — Onde estamos</span><h2>Um espaço para você<br /><em>se sentir cuidado.</em></h2></div>
        <div className="clinic-grid">
          <div className="clinic-main"><img src={clinic} alt="Consultório Danielle Evangelista" /></div>
          <div className="clinic-info">
            <div className="info-icon"><MapPin size={20} /></div>
            <span className="eyebrow"><span /> Consultório</span>
            <h3>Fazenda Rio Grande<br />Paraná</h3>
            <p>Av. Venezuela, 51 — Sobreloja<br />Sala 02 — Eucaliptos<br />Fazenda Rio Grande — PR<br />83820-554</p>
            <a className="text-link" href={siteLinks.maps} target="_blank" rel="noreferrer">Ver localização <MoveUpRight size={16} /></a>
          </div>
        </div>
      </div>
    </section>
  )
}
