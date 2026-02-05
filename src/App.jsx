import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TopTreks from './components/TopTreks'
import Footer from './components/Footer'
import { buildApiUrl } from './utils/urls'

const TREKS_ENDPOINT = buildApiUrl('/api/treks')

export default function App() {
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
        const sorted = [...payload.data].sort(
          (a, b) => (b?.score?.average ?? 0) - (a?.score?.average ?? 0)
        )
        setTreks(sorted)
      } catch (err) {
        setError('No se pudieron cargar las excursiones. Intenta de nuevo en unos minutos.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTreks()
  }, [])

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white antialiased flex flex-col min-h-screen">
      <Header />
      <Hero />
      <TopTreks treks={treks} isLoading={isLoading} error={error} />
      <Footer />
    </div>
  )
}
