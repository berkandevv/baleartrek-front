export default function TrekDetailsHighlights({ places }) {
  const sortedPlaces = [...places].sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h2 className="text-2xl font-bold text-[#111718] dark:text-white">Puntos Destacados</h2>
        <p className="text-sm text-[#618389]">Lugares clave del recorrido</p>
      </div>

      <div className="space-y-4">
        {sortedPlaces.map((place) => (
          <div
            className="bg-white dark:bg-[#1a2c30] p-6 rounded-xl border border-[#dbe4e6] dark:border-[#2a3c40] flex flex-col gap-3 shadow-sm"
            key={`place-${place.id}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  {place.place_type.name}
                </p>
                <h3 className="text-lg font-bold text-[#111718] dark:text-white">{place.name}</h3>
              </div>
              <span className="text-xs font-semibold text-[#618389] bg-[#f0f4f4] dark:bg-[#2a3c40] px-2.5 py-1 rounded-full">
                #{place.order}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
