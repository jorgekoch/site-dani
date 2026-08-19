import type { ReactNode } from 'react'

import './SiteLayout.css'
import { Footer } from './Footer'
import { Header } from './Header'

interface SiteLayoutProps {
  children: ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
    </div>
  )
}
