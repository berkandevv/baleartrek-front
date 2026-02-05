import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import TopTreks from '../components/TopTreks'
import { buildApiUrl } from '../utils/urls'

const TREKS_ENDPOINT = buildApiUrl('/api/treks')

export default function HomePage() {
  // Top de excursiones mostrado en la home
  const [treks, setTreks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const response = await fetch(TREKS_ENDPOINT)
        if (!response.ok) {
          throw new Error(`Error al cargar excursiones (${response.status})`)
        }
        const payload = await response.json()
        // Ordena por puntuación media y limita a 5 resultados
        const sorted = [...(payload.data ?? [])]
          .sort((a, b) => (b?.score?.average ?? 0) - (a?.score?.average ?? 0))
          .slice(0, 5)

        setTreks(sorted)
      } catch {
        setError('No se pudieron cargar las excursiones. Intenta de nuevo en unos minutos.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTreks()
  }, [])

  return (
    <>
      <Hero />
      <TopTreks treks={treks} isLoading={isLoading} error={error} />
    </>
  )
}
