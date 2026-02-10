import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CatalogFilters from '../components/catalog/CatalogFilters'
import CatalogToolbar from '../components/catalog/CatalogToolbar'
import CatalogGrid from '../components/catalog/CatalogGrid'

// Endpoint del backend para recuperar el catálogo completo de excursiones
const TREKS_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/api/treks`
// Valor centinela para representar "sin filtro de municipio"
const ALL_MUNICIPALITIES = 'all'
const PAGE_SIZE = 6

const uniqueStrings = (items) => {
  const unique = []
  for (const item of items) {
    if (!unique.includes(item)) {
      unique.push(item)
    }
  }
  return unique
}

export default function CatalogPage() {
  // Datos base y estados de la UI
  const [treks, setTreks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  // Filtros activos de isla y municipio
  const [selectedIslands, setSelectedIslands] = useState([])
  const [selectedMunicipality, setSelectedMunicipality] = useState(ALL_MUNICIPALITIES)
  // Criterio de orden actual
  const [sortBy, setSortBy] = useState('name-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchParams] = useSearchParams()
  // Búsqueda compartida por query param `?q=...` desde la URL
  const search = (searchParams.get('q') ?? '').trim().toLowerCase()

  useEffect(() => {
    // Carga inicial de excursiones al montar la página
    const fetchTreks = async () => {
      try {
        setError('')
        const response = await fetch(TREKS_ENDPOINT)
        const payload = await response.json()
        const apiTreks = payload.data
        const apiIslandNames = apiTreks.map((trek) => trek.municipality.island.name)
        const apiIslands = uniqueStrings(apiIslandNames)

        setTreks(apiTreks)
        setSelectedIslands(apiIslands)
      } catch (error) {
        console.error('Error al cargar excursiones:', error)
        setError('No se pudo cargar el catálogo. Revisa la conexión o intenta más tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTreks()
  }, [])

  const activeTreks = treks.filter((trek) => trek.status === 'y')

  // Lista total de islas disponibles
  const islandNames = activeTreks.map((trek) => trek.municipality.island.name)
  const islands = uniqueStrings(islandNames)

  // Set para validación rápida de islas activas
  const islandSet = new Set(selectedIslands)

  // Municipios disponibles según las islas activas (sin duplicados)
  const municipalityNames = activeTreks
    .filter((trek) => islandSet.has(trek.municipality.island.name))
    .map((trek) => trek.municipality.name)
  const municipalities = uniqueStrings(municipalityNames)

  // Catálogo de escursiones final tras aplicar filtros de isla, municipio y búsqueda
  const filteredTreks = activeTreks.filter((trek) => {
    const island = trek.municipality.island.name
    const municipality = trek.municipality.name
    const name = trek.name

    // 1) Filtro por isla
    if (!islandSet.has(island)) return false
    // 2) Filtro por municipio (si no está en "all")
    if (selectedMunicipality !== ALL_MUNICIPALITIES && municipality !== selectedMunicipality) return false
    // 3) Si no hay texto, pasa directamente
    if (!search) return true

    // 4) Búsqueda por nombre de excursión o nombre de municipio
    const byName = name.toLowerCase().includes(search)
    const byMunicipality = municipality.toLowerCase().includes(search)
    return byName || byMunicipality
  })

  // Copia para ordenar sin mutar el array filtrado original
  const sortedTreks = [...filteredTreks]

  // Orden configurable: por puntuación o por nombre (locale ES)
  if (sortBy === 'score-desc') {
    sortedTreks.sort((a, b) => b.score.average - a.score.average)
  } else {
    sortedTreks.sort((a, b) => a.name.localeCompare(b.name, 'es'))
  }

  const fullPages = Math.floor(sortedTreks.length / PAGE_SIZE)
  const hasRemainder = sortedTreks.length % PAGE_SIZE !== 0
  const calculatedPages = hasRemainder ? fullPages + 1 : fullPages
  const totalPages = calculatedPages > 0 ? calculatedPages : 1
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const paginatedTreks = sortedTreks.slice(pageStart, pageStart + PAGE_SIZE)
  const pageNumbers = []
  for (let page = 1; page <= totalPages; page += 1) {
    pageNumbers.push(page)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedIslands, selectedMunicipality, search, sortBy])

  useEffect(() => {
    setCurrentPage((prevPage) => Math.min(prevPage, totalPages))
  }, [totalPages])

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
          Encuentra tu próxima aventura en Baleares
        </h1>
        <p className="text-text-sub text-base max-w-2xl">
          Filtra por isla y municipio y descubre las excursiones mejor valoradas
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
          <CatalogGrid treks={paginatedTreks} isLoading={isLoading} error={error} />
          {!isLoading && sortedTreks.length > 0 && totalPages > 1 ? (
            <div className="flex justify-center mt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                  className={`flex items-center justify-center size-10 rounded-lg border border-[#dbe4e6] dark:border-gray-700 bg-white dark:bg-card-dark text-text-main dark:text-white hover:bg-[#f0f4f4] dark:hover:bg-gray-800 ${
                    currentPage === 1 ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>

                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    aria-label={`Ir a la página ${pageNumber}`}
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                    className={`flex items-center justify-center size-10 rounded-lg ${
                      currentPage === pageNumber
                        ? 'bg-primary text-white font-bold'
                        : 'border border-[#dbe4e6] dark:border-gray-700 bg-white dark:bg-card-dark text-text-main dark:text-white hover:bg-[#f0f4f4] dark:hover:bg-gray-800'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  aria-label="Página siguiente"
                  className={`flex items-center justify-center size-10 rounded-lg border border-[#dbe4e6] dark:border-gray-700 bg-white dark:bg-card-dark text-text-main dark:text-white hover:bg-[#f0f4f4] dark:hover:bg-gray-800 ${
                    currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}
