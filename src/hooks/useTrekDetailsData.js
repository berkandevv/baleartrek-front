import { useCallback, useEffect, useState } from 'react'
import { buildApiUrl } from '../utils/api'

// Construye la URL para un regNumber concreto
const buildTrekEndpoint = (regNumber) => buildApiUrl(`/api/treks/${encodeURIComponent(regNumber)}`)

export function useTrekDetailsData(regNumber) {
  // Estado local de datos, carga y error
  const [trek, setTrek] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Carga el trek desde API y aplica validaciones de estado/publicación
  const fetchTrek = useCallback(async () => {
    setIsLoading(true)
    try {
      setError('')
      const response = await fetch(buildTrekEndpoint(regNumber))
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? 'No se encontró el trek solicitado.'
            : 'No se pudo cargar este trek. Intenta de nuevo más tarde.',
        )
      }
      const trekData = payload?.data
      if (trekData?.status === 'y') {
        setTrek(trekData)
      } else {
        setTrek(null)
        setError('No se encontró el trek solicitado.')
      }
    } catch (fetchError) {
      console.error('Error al cargar el trek:', fetchError)
      setError(fetchError?.message || 'No se pudo cargar este trek. Intenta de nuevo más tarde.')
    } finally {
      setIsLoading(false)
    }
  }, [regNumber])

  // Ejecuta la carga inicial y cuando cambia el identificador del trek
  useEffect(() => {
    fetchTrek()
  }, [fetchTrek])

  return {
    trek,
    isLoading,
    error,
    fetchTrek,
  }
}
