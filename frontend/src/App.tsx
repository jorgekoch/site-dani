import { SiteLayout } from './components/layout/SiteLayout'
import { AboutSection } from './components/sections/AboutSection'
import { ClinicSection } from './components/sections/ClinicSection'
import { CredentialsSection } from './components/sections/CredentialsSection'
import { CtaSection } from './components/sections/CtaSection'
import { FaqSection } from './components/sections/FaqSection'
import { HeroSection } from './components/sections/HeroSection'
import { ProcessSection } from './components/sections/ProcessSection'
import { SpecialtiesSection } from './components/sections/SpecialtiesSection'

function App() {
  return (
    <SiteLayout>
      <HeroSection />
      <AboutSection />
      <ProcessSection />
      <SpecialtiesSection />
      <CredentialsSection />
      <ClinicSection />
      <FaqSection />
      <CtaSection />
    </SiteLayout>
  )
}

export default App
