export default function CatalogFilters({
  islands,
  selectedIslands,
  municipalities,
  selectedMunicipality,
  onToggleIsland,
  onMunicipalityChange,
}) {
  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-8">
      {/* Filtro multiselección por isla */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub">Isla</h3>
        <div className="flex flex-col gap-2">
          {islands.map((island) => {
            const checked = selectedIslands.includes(island)
            return (
              <label
                key={island}
                className="group flex items-center gap-3 p-3 rounded-lg border border-[#dbe4e6] dark:border-gray-700 hover:border-primary dark:hover:border-primary cursor-pointer bg-white dark:bg-card-dark transition-all"
              >
                <input
                  checked={checked}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-5 w-5 bg-transparent"
                  type="checkbox"
                  onChange={() => onToggleIsland(island)}
                />
                <span className="text-sm font-medium text-text-main dark:text-gray-200">{island}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Filtro único por municipio según las islas activas */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub">Municipio</h3>
        <select
          value={selectedMunicipality}
          onChange={(event) => onMunicipalityChange(event.target.value)}
          className="w-full rounded-lg bg-white dark:bg-card-dark border border-[#dbe4e6] dark:border-gray-700 text-text-main dark:text-white py-3 px-4 focus:border-primary focus:ring-0"
        >
          <option value="all">Todos los municipios</option>
          {municipalities.map((municipality) => (
            <option key={municipality} value={municipality}>
              {municipality}
            </option>
          ))}
        </select>
      </div>
    </aside>
  )
}
