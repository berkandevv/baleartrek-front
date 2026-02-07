import CatalogCard from './CatalogCard'

export default function CatalogGrid({ treks, isLoading }) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center text-text-sub">
        Cargando excursiones...
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
