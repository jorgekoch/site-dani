import { Check } from 'lucide-react'

import skeleton from '../../assets/dani-esqueleto.jpeg'
import { credentials } from '../../data/site'

export function CredentialsSection() {
  return (
    <section className="credentials section">
      <div className="container credentials-grid">
        <div className="credentials-photo">
          <img src={skeleton} alt="Danielle em seu ambiente profissional" />
          <div className="photo-caption">Formação contínua<br /><strong>para cuidar melhor.</strong></div>
        </div>

        <div className="credentials-copy">
          <span className="section-kicker">04 — Formação</span>
          <h2>Experiência que<br /><em>se transforma em cuidado.</em></h2>
          <p>Especialista em Tratamento da Coluna Vertebral, com formação e cursos complementares em diferentes áreas da fisioterapia e terapias manuais.</p>
          <ul>{credentials.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul>
        </div>
      </div>
    </section>
  )
}
