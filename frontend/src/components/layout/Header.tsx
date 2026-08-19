import { useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'

import './Header.css'
import logo from '../../assets/dani-logo-horizontal-branca-transparente.png'
import { navigationItems, siteLinks } from '../../data/site'
import { useScrollTo } from '../../hooks/useScrollTo'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const goTo = useScrollTo(() => setMenuOpen(false))

  return (
    <header className={`header ${menuOpen ? 'header-open' : ''}`}>
      <div className="container header__inner">
        <button className="header__brand" onClick={() => goTo('inicio')} aria-label="Ir para o início">
          <img src={logo} alt="Danielle Evangelista — Fisioterapeuta" />
        </button>

        <nav className="header__nav" aria-label="Navegação principal">
          {navigationItems.map((item) => (
            <button key={item.id} onClick={() => goTo(item.id)}>{item.label}</button>
          ))}
        </nav>

        <a className="header__cta" href={siteLinks.whatsapp} target="_blank" rel="noreferrer">
          Agendar avaliação <ArrowRight size={17} />
        </a>

        <button className="header__menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <nav className="header__mobile-nav" aria-label="Navegação mobile">
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
