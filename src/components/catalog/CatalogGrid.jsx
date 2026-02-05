import CatalogCard from './CatalogCard'

export default function CatalogGrid({ treks, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center text-text-sub">
        Cargando catálogo...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/60 dark:text-red-200 p-6">
        {error}
      </div>
    )
  }

  if (treks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center text-text-sub">
        No hay excursiones para esos filtros.
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
