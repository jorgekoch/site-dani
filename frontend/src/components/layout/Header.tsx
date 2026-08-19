import { useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'

import logo from '../../assets/dani-logo-horizontal-transparente.png'
import { navigationItems, siteLinks } from '../../data/site'
import { useScrollTo } from '../../hooks/useScrollTo'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const goTo = useScrollTo(() => setMenuOpen(false))

  return (
    <header className={`header ${menuOpen ? 'header-open' : ''}`}>
      <div className="container header-inner">
        <button className="brand" onClick={() => goTo('inicio')} aria-label="Ir para o início">
          <img src={logo} alt="Danielle Evangelista — Fisioterapeuta" />
        </button>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigationItems.map((item) => (
            <button key={item.id} onClick={() => goTo(item.id)}>{item.label}</button>
          ))}
        </nav>

        <a className="header-cta" href={siteLinks.whatsapp} target="_blank" rel="noreferrer">
          Agendar avaliação <ArrowRight size={17} />
        </a>

        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Navegação mobile">
          {navigationItems.map((item) => (
            <button key={item.id} onClick={() => goTo(item.id)}>{item.label}</button>
          ))}
          <a href={siteLinks.whatsapp} target="_blank" rel="noreferrer">
            Agendar avaliação <ArrowRight size={16} />
          </a>
        </nav>
      )}
    </header>
  )
}
