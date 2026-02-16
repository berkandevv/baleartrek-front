import { Link } from 'react-router-dom'
import { resolveImageUrl } from '../../../utils/urls'

export default function CatalogCard({ trek }) {
  const average = Number(trek?.score?.average)
  const island = trek?.municipality?.island?.name ?? 'Isla desconocida'
  const municipality = trek?.municipality?.name ?? 'Municipio pendiente'
  const trekName = trek?.name ?? 'Ruta sin nombre'
  const trekDescription = trek?.description ?? 'Descripción no disponible.'
  const imageSrc = resolveImageUrl(trek?.imageUrl)
  const detailsHref = trek?.regNumber ? `/treks/${trek.regNumber}` : '/catalogo'

  return (
    <article className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#dbe4e6] shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={imageSrc}
          alt={trekName}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          <div className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-text-main uppercase tracking-wider">
            {island}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="text-lg font-bold text-text-main leading-tight group-hover:text-primary transition-colors">
              {trekName}
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded border border-amber-200 shrink-0">
            <span className="material-symbols-outlined text-[18px] text-amber-500">star</span>
            <span className="text-base font-black text-amber-800">
              {Number.isFinite(average) ? average.toFixed(1) : '0.0'}
            </span>
          </div>
        </div>

        <p className="text-sm text-text-sub line-clamp-3">{trekDescription}</p>
        <div className="mt-auto flex flex-col gap-2">
          <p className="text-xs text-text-sub">
            Municipio: <span className="font-semibold text-text-main">{municipality}</span>
          </p>
          <Link className="self-end text-sm text-primary font-semibold hover:underline" to={detailsHref}>
            Detalles
          </Link>
        </div>
      </div>
    </article>
  )
}
