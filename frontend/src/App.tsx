import { SiteLayout } from './components/layout/SiteLayout'
import { AboutSection } from './components/sections/AboutSection'
import { ClinicSection } from './components/sections/ClinicSection'
import { CredentialsSection } from './components/sections/CredentialsSection'
import { CtaSection } from './components/sections/CtaSection'
import { FaqSection } from './components/sections/FaqSection'
import { HeroSection } from './components/sections/HeroSection'
import { ProcessSection } from './components/sections/ProcessSection'
import { SpecialtiesSection } from './components/sections/SpecialtiesSection'
import { TriagePage } from './components/pages/TriagePage'
import { AdminLoginPage } from './components/pages/AdminLoginPage'
import { AdminTriagePage } from './components/pages/AdminTriagePage'
import { AdminTriageDetailPage } from './components/pages/AdminTriageDetailPage'

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/triagem') return <TriagePage />
  if (path === '/admin/login') return <AdminLoginPage />
  if (path === '/admin/triagens') return <AdminTriagePage />
  if (path.startsWith('/admin/triagens/')) return <AdminTriageDetailPage id={path.split('/').pop() ?? ''} />

  return <SiteLayout><HeroSection /><AboutSection /><ProcessSection /><SpecialtiesSection /><CredentialsSection /><ClinicSection /><FaqSection /><CtaSection /></SiteLayout>
}

export default App
