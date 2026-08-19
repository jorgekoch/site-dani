import { Instagram, MapPin, MoveUpRight, Phone } from 'lucide-react'

import logo from '../../assets/dani-logo-horizontal-transparente.png'
import { siteLinks } from '../../data/site'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div>
          <img className="footer-logo" src={logo} alt="Danielle Evangelista" />
          <p>Fisioterapia com atenção,<br />técnica e empatia.</p>
        </div>

        <div className="footer-links">
          <span>Contato</span>
          <a href={siteLinks.whatsapp} target="_blank" rel="noreferrer"><Phone size={15} /> (41) 99883-7462</a>
          <a href={siteLinks.instagram} target="_blank" rel="noreferrer"><Instagram size={15} /> @danielle.evangelista</a>
        </div>

        <div className="footer-links">
          <span>Consultório</span>
          <a href={siteLinks.maps} target="_blank" rel="noreferrer"><MapPin size={15} /> Fazenda Rio Grande — PR</a>
          <a href={siteLinks.maps} target="_blank" rel="noreferrer">Ver no mapa <MoveUpRight size={14} /></a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Danielle Evangelista. Todos os direitos reservados.</span>
        <span>Fisioterapeuta</span>
      </div>
    </footer>
  )
}
