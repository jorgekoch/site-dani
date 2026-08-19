import { useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  MoveUpRight,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react'

import logo from './assets/dani-logo-horizontal-transparente.png'
import portrait from './assets/dani-transparente.png'
import clinic from './assets/consultorio.jpeg'
import treating from './assets/dani-atendendo.jpeg'
import skeleton from './assets/dani-esqueleto.jpeg'

const whatsapp = 'https://wa.me/5541998837462'
const instagram = 'https://www.instagram.com/danielle.evangelista/'
const maps = 'https://maps.google.com/?q=Av.%20Venezuela%2051%20Sobreloja%20Sala%2002%20Fazenda%20Rio%20Grande%20PR'

const specialties = [
  'Coluna vertebral',
  'Quiropraxia',
  'Terapias manuais',
  'Reabilitação esportiva',
  'Liberação miofascial',
  'Ventosaterapia',
  'Auriculoterapia',
  'Dry Needling',
  'Laser e terapia ILIB',
  'DTM e cefaleia',
]

const steps = [
  {
    number: '01',
    title: 'Agendamento',
    text: 'Escolha um horário para sua avaliação e receba as orientações para chegar preparado.',
  },
  {
    number: '02',
    title: 'Avaliação prévia',
    text: 'Antes da consulta, você preenche uma ficha para que eu conheça melhor sua queixa e seu histórico.',
  },
  {
    number: '03',
    title: 'Avaliação completa',
    text: 'No consultório, investigamos o seu caso com atenção e definimos a abordagem mais adequada.',
  },
  {
    number: '04',
    title: 'Tratamento individualizado',
    text: 'As técnicas são escolhidas de acordo com o que o seu corpo precisa, sem protocolos prontos.',
  },
]

const credentials = [
  'Graduação em Fisioterapia — UNIP / FAPAR (2019)',
  'Pós-graduação em Quiropraxia — INSPIRAR',
  'Cursos na área do esporte e terapias manuais',
  'Reabilitação integrada na ATM',
  'Pós-operatório de ortognáticas e cirurgias em geral',
  'Liberação miofascial e ventosaterapia',
  'Auriculoterapia e Dry Needling',
  'Terapia ILIB, Laser e Terapia Sistêmica',
  'DTM, cefaleia e abordagens ortognáticas',
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const goTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const faqs = [
    ['Como funciona a primeira consulta?', 'A primeira consulta começa com uma avaliação detalhada do seu caso. A ficha prévia ajuda a entender sua queixa antes da chegada e, durante o atendimento, a avaliação presencial orienta as condutas mais adequadas.'],
    ['Quanto tempo dura o atendimento?', 'As sessões têm duração média de 50 minutos, com atendimento individualizado e foco na sua necessidade.'],
    ['Preciso levar meus exames?', 'Sim. Se você tiver exames relacionados ao que deseja tratar, leve-os para a avaliação. Eles são importantes para compreender o caso e definir o tratamento.'],
    ['O tratamento segue um protocolo fixo?', 'Não. A proposta é entender cada pessoa e escolher as técnicas de acordo com a necessidade apresentada.'],
    ['Como faço para agendar?', 'Você pode solicitar sua avaliação pelo WhatsApp ou, quando a agenda online estiver disponível, escolher diretamente um horário pelo site.'],
  ]

  return (
    <div className="site-shell">
      <header className={`header ${menuOpen ? 'header-open' : ''}`}>
        <div className="container header-inner">
          <button className="brand" onClick={() => goTo('inicio')} aria-label="Ir para o início">
            <img src={logo} alt="Danielle Evangelista — Fisioterapeuta" />
          </button>

          <nav className="desktop-nav" aria-label="Navegação principal">
            <button onClick={() => goTo('sobre')}>Sobre</button>
            <button onClick={() => goTo('atendimento')}>Atendimento</button>
            <button onClick={() => goTo('especialidades')}>Especialidades</button>
            <button onClick={() => goTo('consultorio')}>Consultório</button>
            <button onClick={() => goTo('faq')}>Dúvidas</button>
          </nav>

          <a className="header-cta" href={whatsapp} target="_blank" rel="noreferrer">
            Agendar avaliação <ArrowRight size={17} />
          </a>

          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav">
            {['sobre', 'atendimento', 'especialidades', 'consultorio', 'faq'].map((item) => (
              <button key={item} onClick={() => goTo(item)}>
                {item === 'sobre' ? 'Sobre' : item === 'atendimento' ? 'Atendimento' : item === 'especialidades' ? 'Especialidades' : item === 'consultorio' ? 'Consultório' : 'Dúvidas'}
              </button>
            ))}
            <a href={whatsapp} target="_blank" rel="noreferrer">Agendar avaliação <ArrowRight size={16} /></a>
          </nav>
        )}
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-noise" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow"><span /> Fisioterapia • Fazenda Rio Grande</span>
              <h1>Seu corpo fala.<br /><em>Eu escuto.</em></h1>
              <p className="hero-lead">Cuidado individualizado para aliviar dores, recuperar movimentos e devolver qualidade de vida.</p>
              <div className="hero-actions">
                <a className="button button-primary" href={whatsapp} target="_blank" rel="noreferrer">Agendar avaliação <ArrowRight size={18} /></a>
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

        <section className="intro section" id="sobre">
          <div className="container intro-grid">
            <div className="section-kicker">01 — Quem cuida de você</div>
            <div className="intro-copy">
              <p className="display-title">“Cada pessoa é única. Por isso, não sigo protocolos prontos — prefiro entender cada caso e tratar o que realmente importa: <strong>você.</strong>”</p>
              <p>Eu sou Danielle Evangelista, mas pode me chamar de “fisio”, “doutora”, “mãos de anjo” (ou de pedra), ou só “Dani”. Sou apaixonada pela minha profissão e acredito que um bom tratamento começa quando a gente realmente escuta o corpo.</p>
              <a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">Quero conversar com a Dani <ArrowRight size={17} /></a>
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

        <section className="process section" id="atendimento">
          <div className="container">
            <div className="section-heading">
              <div><span className="section-kicker">02 — Como funciona</span><h2>Um atendimento pensado<br /><em>para o seu caso.</em></h2></div>
              <p>Antes de tratar, eu preciso entender. A avaliação é o ponto de partida para uma conduta mais precisa, segura e personalizada.</p>
            </div>
            <div className="steps">
              {steps.map((step) => (
                <article className="step" key={step.number}>
                  <span className="step-number">{step.number}</span>
                  <div><h3>{step.title}</h3><p>{step.text}</p></div>
                </article>
              ))}
            </div>
            <div className="process-feature">
              <div className="process-image"><img src={clinic} alt="Ambiente do consultório" /></div>
              <div className="process-content">
                <span className="eyebrow"><span /> Durante a sessão</span>
                <h3>Técnica, atenção<br />e <em>presença.</em></h3>
                <p>Conforme a sua necessidade, podem ser utilizadas técnicas de fisioterapia, quiropraxia, liberação miofascial, ventosaterapia, bota pneumática, auriculoterapia, laserterapia, entre outras abordagens.</p>
                <div className="duration"><Clock3 size={20} /><div><strong>Duração média de 50 minutos</strong><span>Uma sessão individual e sem pressa.</span></div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="specialties section" id="especialidades">
          <div className="container">
            <div className="specialties-top">
              <div><span className="section-kicker">03 — Áreas de atuação</span><h2>Conhecimento para<br /><em>olhar o todo.</em></h2></div>
              <p>Uma formação construída entre fisioterapia, coluna, terapias manuais e diferentes abordagens para cuidar de cada necessidade.</p>
            </div>
            <div className="specialties-grid">
              {specialties.map((item, index) => <div className="specialty" key={item}><span>0{index + 1}</span><strong>{item}</strong><ArrowRight size={16} /></div>)}
            </div>
          </div>
        </section>

        <section className="credentials section">
          <div className="container credentials-grid">
            <div className="credentials-photo"><img src={skeleton} alt="Danielle em seu ambiente profissional" /><div className="photo-caption">Formação contínua<br /><strong>para cuidar melhor.</strong></div></div>
            <div className="credentials-copy">
              <span className="section-kicker">04 — Formação</span>
              <h2>Experiência que<br /><em>se transforma em cuidado.</em></h2>
              <p>Especialista em Tratamento da Coluna Vertebral, com formação e cursos complementares em diferentes áreas da fisioterapia e terapias manuais.</p>
              <ul>{credentials.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul>
            </div>
          </div>
        </section>

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
                <a className="text-link" href={maps} target="_blank" rel="noreferrer">Ver localização <MoveUpRight size={16} /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="faq section" id="faq">
          <div className="container faq-grid">
            <div><span className="section-kicker">06 — Dúvidas</span><h2>Antes de vir,<br /><em>pode perguntar.</em></h2><p>Se ainda ficou alguma dúvida sobre o atendimento, fale comigo pelo WhatsApp.</p><a className="button button-outline" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Falar pelo WhatsApp</a></div>
            <div className="faq-list">
              {faqs.map(([question, answer], index) => (
                <div className={`faq-item ${openFaq === index ? 'active' : ''}`} key={question}>
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{question}</span>{openFaq === index ? <X size={18} /> : <ChevronDown size={18} />}</button>
                  {openFaq === index && <p>{answer}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="cta-glow" />
          <div className="container cta-inner">
            <span className="section-kicker">Seu próximo passo</span>
            <h2>Chega de conviver<br />com a <em>dor.</em></h2>
            <p>Vamos entender o que seu corpo está tentando dizer.</p>
            <a className="button button-light" href={whatsapp} target="_blank" rel="noreferrer">Agendar minha avaliação <ArrowRight size={18} /></a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-top">
          <div><img className="footer-logo" src={logo} alt="Danielle Evangelista" /><p>Fisioterapia com atenção,<br />técnica e empatia.</p></div>
          <div className="footer-links"><span>Contato</span><a href={whatsapp} target="_blank" rel="noreferrer"><Phone size={15} /> (41) 99883-7462</a><a href={instagram} target="_blank" rel="noreferrer"><Instagram size={15} /> @danielle.evangelista</a></div>
          <div className="footer-links"><span>Consultório</span><a href={maps} target="_blank" rel="noreferrer"><MapPin size={15} /> Fazenda Rio Grande — PR</a><a href={maps} target="_blank" rel="noreferrer">Ver no mapa <MoveUpRight size={14} /></a></div>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} Danielle Evangelista. Todos os direitos reservados.</span><span>Fisioterapeuta</span></div>
      </footer>
    </div>
  )
}

export default App
