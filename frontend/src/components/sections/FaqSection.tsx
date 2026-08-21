import { useState } from 'react'
import { ChevronDown, MessageCircle, X } from 'lucide-react'

import './FaqSection.css'
import { faqs, siteLinks } from '../../data/site'

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section className="faq section" id="faq">
      <div className="container faq-grid">
        <div>
          <span className="section-kicker">07 — Dúvidas</span>
          <h2>Antes de vir,<br /><em>pode perguntar.</em></h2>
          <p>Se ainda ficou alguma dúvida sobre o atendimento, fale comigo pelo WhatsApp.</p>
          <a className="button button-outline" href={siteLinks.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Falar pelo WhatsApp</a>
        </div>

        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <div className={`faq-item ${openFaq === index ? 'active' : ''}`} key={question}>
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                <span>{question}</span>
                {openFaq === index ? <X size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === index && <p>{answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
