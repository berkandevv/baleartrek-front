import { useCallback, useEffect, useState } from 'react'
import { buildApiUrl } from '../../shared/utils/api'
import { requestJson } from '../../shared/utils/httpClient'

// Construye la URL para un regNumber concreto
const buildTrekEndpoint = (regNumber) => buildApiUrl(`/api/treks/${encodeURIComponent(regNumber)}`)

// Obtiene y mantiene en estado los datos del trek solicitado por número de registro
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
      const payload = await requestJson(
        buildTrekEndpoint(regNumber),
        undefined,
        'No se pudo cargar este trek. Intenta de nuevo más tarde.',
      )
      const trekData = payload?.data
      if (trekData?.status === 'y') {
        setTrek(trekData)
      } else {
        setTrek(null)
        setError('No se encontró el trek solicitado.')
      }
    } catch (fetchError) {
      console.error('Error al cargar el trek:', fetchError)
      setError(
        fetchError?.status === 404
          ? 'No se encontró el trek solicitado.'
          : (fetchError?.message || 'No se pudo cargar este trek. Intenta de nuevo más tarde.'),
      )
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
