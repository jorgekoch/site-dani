import { useCallback } from 'react'

export function useScrollTo(closeMenu?: () => void) {
  return useCallback((id: string) => {
    closeMenu?.()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [closeMenu])
}
