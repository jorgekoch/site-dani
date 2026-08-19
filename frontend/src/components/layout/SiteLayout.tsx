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
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
