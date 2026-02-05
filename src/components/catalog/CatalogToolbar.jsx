export default function CatalogToolbar({ total, sortBy, onSortChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-card-dark rounded-xl border border-[#dbe4e6] dark:border-gray-800 shadow-sm">
      <p className="text-text-main dark:text-white font-medium">
        Mostrando <span className="font-bold">{total}</span> resultados
      </p>
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-sub hidden sm:inline-block">Ordenar por:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            className="appearance-none bg-[#f0f4f4] dark:bg-gray-800 border-none rounded-lg text-sm font-medium py-2 pl-3 pr-8 text-text-main dark:text-white focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="score-desc">Puntuación</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-main dark:text-white">
            <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </div>
        </div>
      </div>
    </div>
  )
}
