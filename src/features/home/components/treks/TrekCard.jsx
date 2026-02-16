import { Link } from 'react-router-dom'
import { parseLocalDateTime } from '../../../shared/utils/date'
import { resolveImageUrl } from '../../../shared/utils/urls'

// Calcula la próxima fecha de encuentro futura para mostrarla en la tarjeta
function getNextMeetingLabel(meetings) {
  const now = new Date()
  // Convierte cada encuentro en fecha local para filtrar y ordenar solo los futuros
  const upcomingDates = (meetings?.map?.((meeting) => parseLocalDateTime(meeting?.day, meeting?.hour)) ?? [])
    .filter(Boolean)
    .filter((date) => date >= now)
    .sort((a, b) => a - b)

  if (upcomingDates.length === 0) {
    return { label: 'Fechas por confirmar', isConfirmed: false, dateLabel: '', timeLabel: '' }
  }
  const nextDate = upcomingDates[0]
  const dateLabel = nextDate.toLocaleDateString('es-ES', { dateStyle: 'medium' })
  const timeLabel = nextDate.toLocaleTimeString('es-ES', { timeStyle: 'short' })
  return { label: `${dateLabel} ${timeLabel}`, isConfirmed: true, dateLabel, timeLabel }
}

// Renderiza una tarjeta de excursión con valoración, ubicación y próximo encuentro
export default function TrekCard({ trek }) {
  const average = Number(trek?.score?.average)
  const averageLabel = Number.isFinite(average) ? average.toFixed(1) : '0.0'
  const scoreCount = Number(trek?.score?.count) || 0
  const island = trek?.municipality?.island?.name ?? 'Isla desconocida'
  const municipality = trek?.municipality?.name ?? 'Municipio pendiente'
  const trekName = trek?.name ?? 'Ruta sin nombre'
  const trekDescription = trek?.description ?? 'Descripción no disponible.'
  const meetingInfo = getNextMeetingLabel(trek?.meetings)
  const imageSrc = resolveImageUrl(trek?.imageUrl)
  const detailsHref = trek?.regNumber ? `/treks/${trek.regNumber}` : '/catalogo'

  return (
    <article className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="aspect-[4/3] xl:aspect-[3/4] w-full overflow-hidden relative">
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500 bg-gray-100"
          style={{ backgroundImage: `url('${imageSrc}')` }}
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-sm font-bold text-text-main shadow-md flex items-center gap-1.5 border border-gray-100">
            <span className="material-symbols-outlined text-yellow-500 text-[16px] fill-current">star</span>
            {averageLabel}
            <span className="text-[10px] font-semibold text-text-muted">
            ({scoreCount})
            </span>
          </div>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
              {island}
            </p>
          </div>
          <h3 className="text-base font-bold text-text-main leading-tight group-hover:text-primary transition-colors">
            {trekName}
          </h3>
          <p className="text-xs text-text-muted mt-2">
            {trekDescription}
          </p>
          <p className="text-xs md:text-sm text-text-muted mt-2">
            Municipio: <span className="font-semibold text-text-main">{municipality}</span>
          </p>
        </div>
        <div className="mt-auto border-t border-gray-100 pt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {meetingInfo.isConfirmed ? (
              <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">Próximo encuentro</span>
            ) : null}
            {meetingInfo.isConfirmed ? (
              <span className="text-xs md:text-sm text-text-muted">
                <span>{meetingInfo.dateLabel}</span>
                <span className="whitespace-nowrap">
                  <span className="mx-1">·</span>
                  <span>{meetingInfo.timeLabel}</span>
                </span>
              </span>
            ) : (
              <span className="text-xs md:text-sm text-text-muted">{meetingInfo.label}</span>
            )}
          </div>
          <Link className="shrink-0 pl-3 border-l border-gray-200 text-sm text-primary font-semibold hover:underline whitespace-nowrap" to={detailsHref}>
            Detalles
          </Link>
        </div>
      </div>
    </article>
  )
}
