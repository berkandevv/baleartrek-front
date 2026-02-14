import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import TopTreks from '../components/treks/TopTreks'
import { fetchTreks, getTopTreksByScore } from '../utils/treks'

export default function HomePage() {
  // Top de excursiones mostrado en la home
  const [treks, setTreks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTreks = async () => {
      try {
        setError('')
        const allTreks = await fetchTreks()
        setTreks(getTopTreksByScore(allTreks, 5))
      } catch (error) {
        console.error('Error al cargar excursiones:', error)
        setError('No se pudieron cargar las excursiones destacadas.')
      } finally {
        setIsLoading(false)
      }
    }

    loadTreks()
  }, [])

  return (
    <>
      <Hero />
      <TopTreks treks={treks} isLoading={isLoading} error={error} />
    </>
  )
}
