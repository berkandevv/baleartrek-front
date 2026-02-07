import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import TopTreks from '../components/treks/TopTreks'

const TREKS_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/api/treks`

export default function HomePage() {
  // Top de excursiones mostrado en la home
  const [treks, setTreks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        setError('')
        const response = await fetch(TREKS_ENDPOINT)
        const payload = await response.json()
        const sorted = [...payload.data]
          .sort((a, b) => b.score.average - a.score.average)
          .slice(0, 5)

        setTreks(sorted)
      } catch (error) {
        console.error('Error al cargar excursiones:', error)
        setError('No se pudieron cargar las excursiones destacadas.')
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
