import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CatalogFilters from '../components/catalog/CatalogFilters'
import CatalogToolbar from '../components/catalog/CatalogToolbar'
import CatalogGrid from '../components/catalog/CatalogGrid'
import { fetchTreks } from '../utils/treks'
// Valor centinela para representar "sin filtro de municipio"
const ALL_MUNICIPALITIES = 'all'
const PAGE_SIZE = 6
const getIslandName = (trek) => trek?.municipality?.island?.name ?? ''
const getMunicipalityName = (trek) => trek?.municipality?.name ?? ''
const getTrekName = (trek) => trek?.name ?? ''

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
    const loadTreks = async () => {
      try {
        setError('')
        const apiTreks = await fetchTreks()
        const apiIslandNames = apiTreks.map(getIslandName).filter(Boolean)
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

    loadTreks()
  }, [])

  const activeTreks = treks.filter((trek) => trek.status === 'y')

  // Lista total de islas disponibles
  const islandNames = activeTreks.map(getIslandName).filter(Boolean)
  const islands = uniqueStrings(islandNames)

  // Set para validación rápida de islas activas
  const islandSet = new Set(selectedIslands)

  // Municipios disponibles según las islas activas (sin duplicados)
  const municipalityNames = activeTreks
    .filter((trek) => islandSet.has(getIslandName(trek)))
    .map(getMunicipalityName)
    .filter(Boolean)
  const municipalities = uniqueStrings(municipalityNames)

  // Catálogo de escursiones final tras aplicar filtros de isla, municipio y búsqueda
  const filteredTreks = activeTreks.filter((trek) => {
    const island = getIslandName(trek)
    const municipality = getMunicipalityName(trek)
    const name = getTrekName(trek)

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
    sortedTreks.sort((a, b) => (Number(b?.score?.average) || 0) - (Number(a?.score?.average) || 0))
  } else {
    sortedTreks.sort((a, b) => getTrekName(a).localeCompare(getTrekName(b), 'es'))
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
        <h1 className="text-3xl md:text-4xl font-black tracking-[-0.033em] text-text-main mb-2">
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
                  className={`flex items-center justify-center size-10 rounded-lg border border-[#dbe4e6] bg-white text-text-main hover:bg-[#f0f4f4] ${
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
                        : 'border border-[#dbe4e6] bg-white text-text-main hover:bg-[#f0f4f4]'
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
                  className={`flex items-center justify-center size-10 rounded-lg border border-[#dbe4e6] bg-white text-text-main hover:bg-[#f0f4f4] ${
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
