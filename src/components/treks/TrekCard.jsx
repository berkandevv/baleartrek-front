import { resolveImageUrl } from '../../utils/urls'

function getNextMeetingLabel(meetings) {
  const now = new Date()
  const upcomingDates = (meetings ?? [])
    .map((meeting) => {
      if (!meeting?.day || !meeting?.hour) return null
      const date = new Date(`${meeting.day}T${meeting.hour}`)
      if (Number.isNaN(date.getTime())) return null
      return date
    })
    .filter((date) => date && date >= now)
    .sort((a, b) => a - b)

  if (upcomingDates.length === 0) return null
  const nextDate = upcomingDates[0]
  const formattedDate = nextDate.toLocaleDateString('es-ES', { dateStyle: 'medium' })
  const formattedTime = nextDate.toLocaleTimeString('es-ES', { timeStyle: 'short' })
  return `${formattedDate} · ${formattedTime}`
}

export default function TrekCard({ trek }) {
  const average = trek.score?.average ?? 0
  const island = trek.municipality?.island?.name
  const municipality = trek.municipality?.name
  const meetingLabel = getNextMeetingLabel(trek.meetings)
  const rawImage = trek.imageUrl || ''
  const imageSrc = resolveImageUrl(rawImage)

  return (
    <article className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="aspect-[4/3] xl:aspect-[3/4] w-full overflow-hidden relative">
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500 bg-gray-100 dark:bg-gray-800"
          style={imageSrc ? { backgroundImage: `url('${imageSrc}')` } : undefined}
        />
        <div className="absolute top-3 right-3 bg-white/95 dark:bg-black/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-sm font-bold text-text-main dark:text-white shadow-md flex items-center gap-1.5 border border-gray-100 dark:border-gray-700">
          <span className="material-symbols-outlined text-yellow-500 text-[16px] fill-current">star</span>
          {Number.isFinite(average) ? average.toFixed(1) : '0.0'}
          <span className="text-[10px] font-semibold text-text-muted dark:text-gray-400">
            ({trek?.score?.count ?? 0})
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
              {island || 'Baleares'}
            </p>
          </div>
          <h3 className="text-base font-bold text-text-main dark:text-white leading-tight group-hover:text-primary transition-colors">
            {trek.name}
          </h3>
          <p className="text-xs text-text-muted dark:text-gray-400 mt-2">
            {trek.description}
          </p>
          {municipality ? (
            <p className="text-xs md:text-sm text-text-muted dark:text-gray-400 mt-2">
              Municipio: <span className="font-semibold text-text-main dark:text-white">{municipality}</span>
            </p>
          ) : null}
        </div>
        <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-3 flex items-center justify-between text-xs text-text-muted dark:text-gray-400">
          <div className="text-right">
            {meetingLabel ? (
              <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">Próxima salida</span>
            ) : null}
            <span className="text-xs md:text-sm text-text-muted dark:text-gray-400">
              {meetingLabel || 'Fechas por confirmar'}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
