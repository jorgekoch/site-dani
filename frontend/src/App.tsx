import { useState } from 'react'
import styled from 'styled-components'
import portrait from './assets/dani-transparente.png'
import logo from './assets/dani-logo-horizontal-transparente.png'
import clinic from './assets/consultorio.jpeg'

const services = [
  { number: '01', title: 'Avaliação individualizada', text: 'Um olhar cuidadoso para compreender suas necessidades antes de definir a melhor estratégia de tratamento.' },
  { number: '02', title: 'Tratamento personalizado', text: 'Recursos e técnicas escolhidos de acordo com cada caso, respeitando o seu corpo e seus objetivos.' },
  { number: '03', title: 'Acompanhamento próximo', text: 'Um processo construído com escuta, clareza e atenção em cada etapa.' },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Page>
      <Header>
        <HeaderInner>
          <a href="#inicio" aria-label="Danielle Evangelista — início"><Logo src={logo} alt="Danielle Evangelista — Fisioterapeuta" /></a>
          <Nav $open={menuOpen}>
            <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>
            <a href="#atendimento" onClick={() => setMenuOpen(false)}>Atendimento</a>
            <a href="#espaco" onClick={() => setMenuOpen(false)}>Espaço</a>
            <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>
          </Nav>
          <HeaderCta href="#agendar">Agendar avaliação <span>↗</span></HeaderCta>
          <MenuButton aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)}><i /><i /></MenuButton>
        </HeaderInner>
      </Header>

      <main>
        <Hero id="inicio">
          <HeroCopy>
            <Eyebrow>FISIOTERAPIA · FAZENDA RIO GRANDE</Eyebrow>
            <HeroTitle>Seu corpo não é um protocolo<span>.</span></HeroTitle>
            <HeroText>Uma abordagem individualizada para compreender o seu corpo, tratar o que importa e acompanhar cada etapa do seu processo.</HeroText>
            <HeroActions>
              <Primary href="#agendar">Agendar avaliação <span>↗</span></Primary>
              <Secondary href="#sobre">Conheça meu trabalho <span>↓</span></Secondary>
            </HeroActions>
          </HeroCopy>
          <HeroVisual>
            <Portrait src={portrait} alt="Danielle Evangelista, fisioterapeuta" />
            <PortraitLabel><strong>Danielle</strong><span>Evangelista · Fisioterapeuta</span></PortraitLabel>
          </HeroVisual>
          <ScrollHint><span>01</span><div /><span>scroll</span></ScrollHint>
        </Hero>

        <Manifesto id="sobre">
          <SectionKicker>01 — SOBRE</SectionKicker>
          <ManifestoGrid>
            <BigQuote>Cada pessoa é <em>única.</em><br />Seu tratamento também.</BigQuote>
            <ManifestoText>
              <p>Meu trabalho começa antes da técnica. Começa pela escuta, pela avaliação e pela compreensão de quem está na minha frente.</p>
              <p>A partir disso, construímos um cuidado personalizado, buscando não apenas aliviar sintomas, mas entender o que o seu corpo está comunicando.</p>
              <a href="#contato">Conheça Danielle Evangelista <span>↗</span></a>
            </ManifestoText>
          </ManifestoGrid>
        </Manifesto>

        <Services id="atendimento">
          <SectionKicker>02 — ATENDIMENTO</SectionKicker>
          <SectionHeading>Um cuidado pensado<br />para <em>você.</em></SectionHeading>
          <ServiceList>
            {services.map((service) => (
              <Service key={service.number}><ServiceNumber>{service.number}</ServiceNumber><div><h3>{service.title}</h3><p>{service.text}</p></div><Arrow>↗</Arrow></Service>
            ))}
          </ServiceList>
        </Services>

        <Clinic id="espaco">
          <ClinicImage src={clinic} alt="Interior do consultório de Danielle Evangelista" />
          <ClinicCopy><SectionKicker>03 — O ESPAÇO</SectionKicker><h2>Um espaço para<br /><em>cuidar.</em></h2><p>Um ambiente preparado para receber você com tranquilidade, privacidade e atenção.</p><Address>Av. Venezuela, 51 — Sobreloja · Sala 02<br />Eucaliptos · Fazenda Rio Grande — PR</Address><a href="https://g.co/kgs/1sGY8A" target="_blank" rel="noreferrer">Como chegar <span>↗</span></a></ClinicCopy>
        </Clinic>

        <Booking id="agendar">
          <SectionKicker>04 — PRIMEIRO PASSO</SectionKicker>
          <BookingGrid><h2>Vamos começar<br />por uma <em>avaliação?</em></h2><div><p>Conte um pouco sobre o que você está buscando. O primeiro atendimento é o momento de entender seu caso e construir um caminho de cuidado.</p><Primary href="mailto:contato@danielleevangelista.com.br?subject=Agendamento%20de%20avaliação">Solicitar agendamento <span>↗</span></Primary><Small>O sistema de agendamento online será integrado ao site na próxima etapa.</Small></div></BookingGrid>
        </Booking>

        <Contact id="contato"><div><SectionKicker>05 — CONTATO</SectionKicker><h2>Cuide de você<br /><em>com intenção.</em></h2></div><ContactLinks><a href="https://linktr.ee/danielle_evangelista" target="_blank" rel="noreferrer">Instagram / Links <span>↗</span></a><a href="https://g.co/kgs/1sGY8A" target="_blank" rel="noreferrer">Localização <span>↗</span></a><a href="#agendar">Agendar avaliação <span>↗</span></a></ContactLinks></Contact>
      </main>

      <Footer><img src={logo} alt="Danielle Evangelista" /><span>© {new Date().getFullYear()} Danielle Evangelista · Fisioterapeuta</span><span>Fazenda Rio Grande · PR</span></Footer>
    </Page>
  )
}

const Page = styled.div`overflow: hidden; background:#070707;`
const Header = styled.header`position:fixed; z-index:20; top:0; left:0; width:100%; border-bottom:1px solid rgba(255,255,255,.1); background:rgba(7,7,7,.78); backdrop-filter:blur(18px);`
const HeaderInner = styled.div`height:78px; max-width:1440px; margin:auto; padding:0 48px; display:flex; align-items:center; justify-content:space-between; gap:32px; @media(max-width:800px){padding:0 22px;}`
const Logo = styled.img`width:190px; height:auto; @media(max-width:800px){width:160px;}`
const Nav = styled.nav<{ $open:boolean }>`display:flex; gap:34px; align-items:center; margin-left:auto; a{font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#aaa;transition:.25s} a:hover{color:#fff} @media(max-width:800px){display:${p=>p.$open?'flex':'none'};position:absolute;top:78px;left:0;right:0;padding:28px 22px;flex-direction:column;align-items:flex-start;background:#070707;border-bottom:1px solid #222;gap:22px;}`
const HeaderCta = styled.a`border:1px solid #444;padding:12px 16px;font-size:11px;text-transform:uppercase;letter-spacing:.1em;transition:.25s;&:hover{background:#f5f5f2;color:#070707}@media(max-width:800px){display:none}`
const MenuButton = styled.button`display:none;background:none;border:0;padding:8px;@media(max-width:800px){display:grid;gap:6px} i{display:block;width:24px;height:1px;background:#fff}`
const Hero = styled.section`min-height:100vh;max-width:1440px;margin:auto;padding:78px 48px 0;display:grid;grid-template-columns:48% 52%;position:relative;@media(max-width:900px){grid-template-columns:1fr;padding:78px 22px 0;}`
const HeroCopy = styled.div`align-self:center;z-index:2;padding-bottom:70px;max-width:680px;@media(max-width:900px){padding:70px 0 20px}`
const Eyebrow = styled.div`font-size:10px;letter-spacing:.22em;color:#888;margin-bottom:30px;`
const HeroTitle = styled.h1`font-size:clamp(54px,6.5vw,100px);line-height:.9;letter-spacing:-.055em;font-weight:500;margin:0 0 34px;max-width:700px;span{color:#777}`
const HeroText = styled.p`font-size:17px;line-height:1.7;color:#aaa;max-width:500px;margin:0 0 36px;`
const HeroActions = styled.div`display:flex;gap:12px;flex-wrap:wrap`
const Primary = styled.a`display:inline-flex;gap:24px;align-items:center;background:#f5f5f2;color:#070707;padding:16px 19px;font-size:11px;text-transform:uppercase;letter-spacing:.11em;transition:.25s;&:hover{transform:translateY(-2px);background:#fff}`
const Secondary = styled.a`display:inline-flex;gap:20px;align-items:center;padding:16px 0;margin-left:4px;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#aaa;border-bottom:1px solid #444`
const HeroVisual = styled.div`position:relative;min-height:700px;display:flex;align-items:flex-end;justify-content:flex-end;@media(max-width:900px){min-height:580px;margin:0 -22px}`
const Portrait = styled.img`height:min(88vh,850px);width:auto;object-fit:contain;object-position:bottom right;filter:grayscale(1);@media(max-width:900px){height:70vh;max-width:100%;}`
const PortraitLabel = styled.div`position:absolute;right:8%;bottom:8%;display:flex;flex-direction:column;align-items:flex-end;color:#fff;text-align:right;text-shadow:0 2px 20px #000;strong{font-size:25px;font-weight:400}span{font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:#aaa}`
const ScrollHint = styled.div`position:absolute;left:48px;bottom:30px;display:flex;gap:12px;align-items:center;color:#666;font-size:9px;text-transform:uppercase;letter-spacing:.15em;div{width:70px;height:1px;background:#333}@media(max-width:900px){left:22px}`
const Manifesto = styled.section`border-top:1px solid #222;max-width:1440px;margin:auto;padding:130px 48px 150px;@media(max-width:800px){padding:90px 22px}`
const SectionKicker = styled.div`font-size:10px;letter-spacing:.2em;color:#666;text-transform:uppercase;margin-bottom:65px`
const ManifestoGrid = styled.div`display:grid;grid-template-columns:1.35fr 1fr;gap:100px;@media(max-width:800px){grid-template-columns:1fr;gap:45px}`
const BigQuote = styled.h2`font-size:clamp(44px,6vw,86px);line-height:.98;letter-spacing:-.05em;font-weight:400;margin:0;em{font-style:normal;color:#777}`
const ManifestoText = styled.div`max-width:470px;align-self:end;p{color:#999;line-height:1.8;font-size:15px;margin:0 0 20px}a{display:inline-flex;gap:18px;margin-top:16px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;border-bottom:1px solid #444;padding-bottom:10px}`
const Services = styled.section`background:#101010;padding:130px max(48px,calc((100vw - 1344px)/2)) 140px;@media(max-width:800px){padding:90px 22px}`
const SectionHeading = styled.h2`font-size:clamp(44px,6vw,82px);line-height:.95;letter-spacing:-.05em;font-weight:400;margin:0 0 80px;em{font-style:normal;color:#777}`
const ServiceList = styled.div`border-top:1px solid #333;`
const Service = styled.article`display:grid;grid-template-columns:80px 1fr 40px;gap:20px;align-items:start;padding:32px 0;border-bottom:1px solid #333;transition:.25s;&:hover{padding-left:10px}.${''} @media(max-width:600px){grid-template-columns:50px 1fr 25px}`
const ServiceNumber = styled.span`font-size:11px;color:#666;letter-spacing:.12em`
const Arrow = styled.span`font-size:20px;color:#777;text-align:right`
const Clinic = styled.section`max-width:1440px;margin:auto;display:grid;grid-template-columns:1.05fr .95fr;min-height:700px;@media(max-width:800px){grid-template-columns:1fr}`
const ClinicImage = styled.img`width:100%;height:100%;min-height:500px;object-fit:cover;filter:grayscale(1);opacity:.82`
const ClinicCopy = styled.div`padding:100px 8%;display:flex;flex-direction:column;justify-content:center;background:#090909;h2{font-size:clamp(50px,6vw,84px);line-height:.9;letter-spacing:-.05em;font-weight:400;margin:0 0 35px}em{font-style:normal;color:#777}p{color:#999;line-height:1.8;max-width:420px}.${''} a{font-size:11px;text-transform:uppercase;letter-spacing:.12em;margin-top:22px;border-bottom:1px solid #444;padding-bottom:10px;width:max-content}`
const Address = styled.address`font-style:normal;color:#ddd;font-size:13px;line-height:1.8;margin-top:18px`
const Booking = styled.section`background:#f5f5f2;color:#070707;padding:120px max(48px,calc((100vw - 1344px)/2));@media(max-width:800px){padding:85px 22px}`
const BookingGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:100px;@media(max-width:800px){grid-template-columns:1fr;gap:45px}h2{font-size:clamp(48px,6vw,84px);line-height:.9;letter-spacing:-.05em;font-weight:400;margin:0}em{font-style:normal;color:#777}p{font-size:16px;line-height:1.75;max-width:470px;color:#444;margin-top:0}`
const Small = styled.small`display:block;color:#888;margin-top:22px;line-height:1.5;max-width:420px`
const Contact = styled.section`max-width:1440px;margin:auto;padding:130px 48px;display:grid;grid-template-columns:1fr 1fr;gap:100px;@media(max-width:800px){grid-template-columns:1fr;padding:90px 22px;gap:50px}h2{font-size:clamp(52px,7vw,100px);line-height:.88;letter-spacing:-.055em;font-weight:400;margin:0}em{font-style:normal;color:#777}`
const ContactLinks = styled.div`align-self:end;display:flex;flex-direction:column;border-top:1px solid #333;a{display:flex;justify-content:space-between;padding:22px 0;border-bottom:1px solid #333;font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:#aaa;transition:.2s;&:hover{color:#fff;padding-left:8px}}`
const Footer = styled.footer`border-top:1px solid #222;max-width:1440px;margin:auto;padding:28px 48px;display:flex;justify-content:space-between;align-items:center;gap:20px;color:#555;font-size:10px;text-transform:uppercase;letter-spacing:.1em;img{width:150px;filter:grayscale(1);opacity:.7}@media(max-width:800px){padding:25px 22px;flex-wrap:wrap;justify-content:flex-start}}`
