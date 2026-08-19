import { ChevronLeft, ChevronRight, MapPin, MoveUpRight } from 'lucide-react'
import { useState } from 'react'

import './ClinicSection.css'
import clinic2 from '../../assets/consultorio (2).jpeg'
import clinic3 from '../../assets/consultorio (3).jpeg'
import clinic4 from '../../assets/consultorio (4).jpeg'
import attending2 from '../../assets/dani-atendendo (2).jpeg'
import attending3 from '../../assets/dani-atendendo (3).jpeg'
import attending4 from '../../assets/dani-atendendo (4).jpeg'
import attending5 from '../../assets/dani-atendendo (5).jpeg'
import { siteLinks } from '../../data/site'

const gallery = [
  { src: clinic2, alt: 'Consultório Danielle Evangelista' },
  { src: clinic3, alt: 'Espaço de atendimento da fisioterapeuta Danielle Evangelista' },
  { src: clinic4, alt: 'Detalhes do consultório Danielle Evangelista' },
  { src: attending2, alt: 'Danielle Evangelista durante atendimento fisioterapêutico' },
  { src: attending3, alt: 'Atendimento fisioterapêutico de Danielle Evangelista' },
  { src: attending4, alt: 'Sessão de fisioterapia no consultório' },
  { src: attending5, alt: 'Atendimento fisioterapêutico no consultório' },
]

export function ClinicSection() {
  const [current, setCurrent] = useState(0)

  const previous = () => setCurrent((index) => (index - 1 + gallery.length) % gallery.length)
  const next = () => setCurrent((index) => (index + 1) % gallery.length)

  return (
    <section className="clinic section" id="consultorio">
      <div className="container">
        <div className="clinic-heading">
          <span className="section-kicker">05 — Onde estamos</span>
          <h2>Um espaço para você<br /><em>se sentir cuidado.</em></h2>
        </div>

        <div className="clinic-gallery-layout">
          <div className="clinic-gallery" aria-label="Galeria do consultório e dos atendimentos">
            <div className="clinic-gallery-stage">
              {gallery.map((image, index) => (
                <img
                  key={image.src}
                  className={`clinic-gallery-image${index === current ? ' is-active' : ''}`}
                  src={image.src}
                  alt={image.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              ))}

              <div className="clinic-gallery-overlay" />

              <div className="clinic-gallery-controls">
                <button type="button" onClick={previous} aria-label="Imagem anterior">
                  <ChevronLeft size={19} />
                </button>
                <span>{String(current + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}</span>
                <button type="button" onClick={next} aria-label="Próxima imagem">
                  <ChevronRight size={19} />
                </button>
              </div>
            </div>

            <div className="clinic-gallery-thumbs" role="tablist" aria-label="Selecionar imagem">
              {gallery.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  className={index === current ? 'is-active' : ''}
                  onClick={() => setCurrent(index)}
                  aria-label={`Mostrar imagem ${index + 1}`}
                  aria-selected={index === current}
                  role="tab"
                >
                  <img src={image.src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

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
