import TrekCard from './TrekCard'

export default function TopTreks({ treks, isLoading, error }) {
  return (
    <section className="py-12 md:py-16 px-4 bg-background-light dark:bg-background-dark -mt-10 relative z-30">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-yellow-500 fill-current text-3xl">hotel_class</span>
              Las 5 Mejores Excursiones Destacadas
            </h2>
            <p className="text-text-muted dark:text-gray-400 mt-2">Las excursiones mejor valoradas por la comunidad.</p>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center text-text-muted dark:text-gray-400">
            Cargando excursiones...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/60 dark:text-red-200 p-6">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {treks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
