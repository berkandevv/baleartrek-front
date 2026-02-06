import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Guarda el valor anterior de scrollRestoration para restaurarlo al salir
    const previous = window.history.scrollRestoration
    if (previous !== 'manual') {
      // Fuerza el modo manual para evitar restauraciones automáticas del navegador
      window.history.scrollRestoration = 'manual'
    }

    // Hace scroll al inicio cuando cambia la ruta
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    return () => {
      if (previous !== window.history.scrollRestoration) {
        // Restaura el valor original al desmontar o antes del siguiente efecto
        window.history.scrollRestoration = previous
      }
    }
  }, [pathname])

  return null
}
