interface SectionKickerProps {
  children: React.ReactNode
}

export function SectionKicker({ children }: SectionKickerProps) {
  return <span className="section-kicker">{children}</span>
}
