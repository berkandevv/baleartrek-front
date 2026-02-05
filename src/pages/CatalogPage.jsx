import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CatalogFilters from '../components/catalog/CatalogFilters'
import CatalogToolbar from '../components/catalog/CatalogToolbar'
import CatalogGrid from '../components/catalog/CatalogGrid'
import { buildApiUrl } from '../utils/urls'

// Endpoint del backend para recuperar el catálogo completo de rutas
const TREKS_ENDPOINT = buildApiUrl('/api/treks')
// Valor centinela para representar "sin filtro de municipio"
const ALL_MUNICIPALITIES = 'all'

// Leer propiedades anidadas de forma segura
const getIslandName = (trek) => trek?.municipality?.island?.name ?? ''
const getMunicipalityName = (trek) => trek?.municipality?.name ?? ''
const getTrekName = (trek) => trek?.name ?? ''
// Elimina valores vacíos y duplicados
const uniqueTruthy = (values) => [...new Set(values.filter(Boolean))]

export default function CatalogPage() {
  // Datos base y estados de la UI
  const [treks, setTreks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  // Filtros activos de isla y municipio
  const [selectedIslands, setSelectedIslands] = useState([])
  const [selectedMunicipality, setSelectedMunicipality] = useState(ALL_MUNICIPALITIES)
  // Criterio de orden actual
  const [sortBy, setSortBy] = useState('name-asc')
  const [searchParams] = useSearchParams()
  // Búsqueda compartida por query param `?q=...` desde la URL
  const search = (searchParams.get('q') ?? '').trim().toLowerCase()

  useEffect(() => {
    // Carga inicial del catálogo al montar la página
    const fetchTreks = async () => {
      try {
        const response = await fetch(TREKS_ENDPOINT)
        if (!response.ok) {
          throw new Error(`Error al cargar excursiones (${response.status})`)
        }

        const payload = await response.json()
        const apiTreks = payload.data ?? []
        // Por defecto quedan seleccionadas todas las islas disponibles
        const apiIslands = uniqueTruthy(apiTreks.map(getIslandName))

        setTreks(apiTreks)
        setSelectedIslands(apiIslands)
      } catch {
        // Mensaje genérico de error para no exponer detalles internos
        setError('No se pudo cargar el catálogo. Intenta de nuevo en unos minutos.')
      } finally {
        // Finaliza el estado de carga tanto si fue bien como si falló
        setIsLoading(false)
      }
    }

    fetchTreks()
  }, [])

  // Lista total de islas disponibles
  const islands = uniqueTruthy(treks.map(getIslandName))

  // Set para validación rápida de islas activas
  const islandSet = new Set(selectedIslands)

  // Municipios disponibles según las islas activas (sin duplicados)
  const municipalities = uniqueTruthy(
    treks
      .filter((trek) => islandSet.has(getIslandName(trek)))
      .map(getMunicipalityName),
  )

  // Catálogo final tras aplicar filtros de isla, municipio y búsqueda
  const filteredTreks = treks.filter((trek) => {
    const island = getIslandName(trek)
    const municipality = getMunicipalityName(trek)
    const name = getTrekName(trek)

    // 1) Filtro por isla
    if (!islandSet.has(island)) return false
    // 2) Filtro por municipio (si no está en "all")
    if (selectedMunicipality !== ALL_MUNICIPALITIES && municipality !== selectedMunicipality) return false
    // 3) Si no hay texto, pasa directamente
    if (!search) return true

    // 4) Búsqueda por nombre de ruta o nombre de municipio
    const byName = name.toLowerCase().includes(search)
    const byMunicipality = municipality.toLowerCase().includes(search)
    return byName || byMunicipality
  })

  // Copia para ordenar sin mutar el array filtrado original
  const sortedTreks = [...filteredTreks]

  // Orden configurable: por puntuación o por nombre (locale ES)
  if (sortBy === 'score-desc') {
    sortedTreks.sort((a, b) => (b?.score?.average ?? 0) - (a?.score?.average ?? 0))
  } else {
    sortedTreks.sort((a, b) => getTrekName(a).localeCompare(getTrekName(b), 'es'))
  }

  const handleToggleIsland = (island) => {
    // Al cambiar islas, se reinicia municipio para evitar filtros incompatibles
    setSelectedMunicipality(ALL_MUNICIPALITIES)
    setSelectedIslands((prev) =>
      prev.includes(island)
        ? prev.filter((item) => item !== island)
        : [...prev, island],
    )
  }

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-[-0.033em] text-text-main dark:text-white mb-2">
          Explora Rutas Baleares
        </h1>
        <p className="text-text-sub text-base max-w-2xl">
          Encuentra tu próxima aventura en el archipiélago balear. Filtra por isla y municipio.
        </p>
      </div>

      {/* Layout principal: filtros a la izquierda y listado a la derecha */}
      <div className="flex flex-col lg:flex-row gap-8">
        <CatalogFilters
          islands={islands}
          selectedIslands={selectedIslands}
          municipalities={municipalities}
          selectedMunicipality={selectedMunicipality}
          onToggleIsland={handleToggleIsland}
          onMunicipalityChange={setSelectedMunicipality}
        />

        {/* Zona de resultados: barra de orden + grid de tarjetas */}
        <main className="flex-1 flex flex-col gap-6">
          <CatalogToolbar total={sortedTreks.length} sortBy={sortBy} onSortChange={setSortBy} />
          <CatalogGrid treks={sortedTreks} isLoading={isLoading} error={error} />
        </main>
      </div>
    </div>
  )
}
