import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'

import './TestimonialsSection.css'
import { reviews, siteLinks } from '../../data/site'

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const next = () => setActiveIndex((index) => (index + 1) % reviews.length)
  const previous = () => setActiveIndex((index) => (index - 1 + reviews.length) % reviews.length)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % reviews.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  const visibleReviews = [
    reviews[(activeIndex - 1 + reviews.length) % reviews.length],
    reviews[activeIndex],
    reviews[(activeIndex + 1) % reviews.length],
  ]

  return (
    <section className="testimonials section" id="depoimentos">
      <div className="container testimonials-shell">
        <div className="testimonials-heading">
          <span className="section-kicker">06 — Depoimentos</span>
          <h2>Pacientes que<br /><em>confiam no cuidado.</em></h2>
          <p>Experiências de pessoas que passaram por atendimento e sentiram melhora com acolhimento, atenção e cuidado individualizado.</p>
          <a className="button button-ghost" href={siteLinks.googleReviews} target="_blank" rel="noreferrer">
            Ver avaliações no Google
          </a>
        </div>

        <div className="testimonials-carousel" aria-label="Carrossel de depoimentos de pacientes">
          <div className="testimonial-track">
            {visibleReviews.map((review, index) => {
              const position = index === 0 ? 'left' : index === 1 ? 'center' : 'right'

              return (
                <article key={`${review.name}-${position}`} className={`testimonial-card is-${position}`}>
                  <div className="testimonial-top">
                    <div className="testimonial-quote">
                      <Quote size={18} />
                    </div>
                    <div className="testimonial-stars" aria-label={`${review.rating} estrelas`}>
                      {Array.from({ length: review.rating }).map((_, starIndex) => (
                        <Star key={`${review.name}-${position}-${starIndex}`} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  <p className="testimonial-text">“{review.text}”</p>

                  <div className="testimonial-author">
                    <span className="testimonial-dot" />
                    <strong>{review.name}</strong>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="testimonial-nav">
            <button type="button" onClick={previous} aria-label="Depoimento anterior">
              <ChevronLeft size={18} />
            </button>
            <button type="button" onClick={next} aria-label="Próximo depoimento">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="testimonial-dots" aria-label="Selecionar depoimento">
            {reviews.map((review, index) => (
              <button
                key={review.name}
                type="button"
                className={index === activeIndex ? 'is-active' : ''}
                onClick={() => setActiveIndex(index)}
                aria-label={`Mostrar depoimento de ${review.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
