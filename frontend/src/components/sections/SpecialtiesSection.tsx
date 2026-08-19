import { ArrowRight } from 'lucide-react'

import { specialties } from '../../data/site'

export function SpecialtiesSection() {
  return (
    <section className="specialties section" id="especialidades">
      <div className="container">
        <div className="specialties-top">
          <div><span className="section-kicker">03 — Áreas de atuação</span><h2>Conhecimento para<br /><em>olhar o todo.</em></h2></div>
          <p>Uma formação construída entre fisioterapia, coluna, terapias manuais e diferentes abordagens para cuidar de cada necessidade.</p>
        </div>

        <div className="specialties-grid">
          {specialties.map((item, index) => (
            <div className="specialty" key={item}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
              <ArrowRight size={16} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
