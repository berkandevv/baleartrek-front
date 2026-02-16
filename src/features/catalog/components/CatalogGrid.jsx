import CatalogCard from './CatalogCard'

// Gestiona la cuadrícula de resultados del catálogo incluyendo estados vacíos
export default function CatalogGrid({ treks, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-text-sub">
        Cargando excursiones...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700">
        {error}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {treks.map((trek) => (
        <CatalogCard key={trek.id} trek={trek} />
      ))}
    </div>
  )
}
