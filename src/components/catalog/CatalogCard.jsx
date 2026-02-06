import { resolveImageUrl } from '../../utils/urls'

export default function CatalogCard({ trek }) {
  const average = trek?.score?.average ?? 0
  const island = trek?.municipality?.island?.name || 'Baleares'
  const imageSrc = resolveImageUrl(trek?.imageUrl || '')

  return (
    <article className="group flex flex-col bg-white dark:bg-card-dark rounded-xl overflow-hidden border border-[#dbe4e6] dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
        {imageSrc ? (
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={imageSrc}
            alt={trek?.name}
          />
        ) : null}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          <div className="bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded text-text-main dark:text-white uppercase tracking-wider">
            {island}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="text-lg font-bold text-text-main dark:text-white leading-tight group-hover:text-primary transition-colors">
              {trek?.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded border border-amber-200 dark:border-amber-800 shrink-0">
            <span className="material-symbols-outlined text-[18px] text-amber-500 fill-1">star</span>
            <span className="text-base font-black text-amber-800 dark:text-amber-400">
              {Number.isFinite(average) ? average.toFixed(1) : '0.0'}
            </span>
          </div>
        </div>

        <p className="text-sm text-text-sub line-clamp-3">{trek?.description}</p>
        <p className="text-xs text-text-sub mt-auto">
          Municipio: <span className="font-semibold text-text-main dark:text-gray-100">{trek?.municipality?.name || 'Sin definir'}</span>
        </p>
      </div>
    </article>
  )
}
