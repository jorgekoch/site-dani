import type { ReactNode } from 'react'

interface SectionKickerProps {
  children: ReactNode
}

export function SectionKicker({ children }: SectionKickerProps) {
  return <span className="section-kicker">{children}</span>
}
