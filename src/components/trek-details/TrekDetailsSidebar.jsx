import { Link } from 'react-router-dom'
import { formatDate, getFullName, getInitials } from '../../utils/trekDetailsUtils'

export default function TrekDetailsSidebar({
  guides,
  appDateIni,
  appDateEnd,
  totalAttendees,
  isOpen,
  statusLabel,
  onSignup,
}) {
  const statusClass = isOpen
    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
    : 'bg-gray-200 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
  const dotClass = isOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
  const formatSignupDate = (date) => formatDate(date, { dateStyle: 'short' })

  return (
    <div className="sticky top-24 flex flex-col gap-4">
      <div className="bg-white dark:bg-[#1a2c30] rounded-xl border border-[#dbe4e6] dark:border-[#2a3c40] shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
        <div className="bg-[#f0f4f4] dark:bg-[#2a3c40] px-6 py-4 flex items-center justify-between border-b border-[#dbe4e6] dark:border-gray-700">
          <span className="text-[#111718] dark:text-white font-bold text-lg">Detalles del Evento</span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusClass}`}>
            <span className={`w-2 h-2 rounded-full ${dotClass}`} />
            {statusLabel}
          </span>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-background-light dark:bg-black/20 text-primary">
                <span className="material-symbols-outlined">supervisor_account</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-[#618389] dark:text-gray-400 font-bold uppercase">Guías Asignados</p>
                </div>
                <div className="flex flex-col gap-2">
                  {guides.map((guide) => (
                    <div className="flex items-center gap-2" key={`guide-${guide.id}`}>
                      <div className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/20 text-[10px] font-bold text-[#111718] dark:text-gray-200 flex items-center justify-center">
                        {getInitials(guide)}
                      </div>
                      <span className="text-xs font-semibold text-[#111718] dark:text-gray-200">
                        {getFullName(guide)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-[#f0f4f4] dark:border-gray-700" />
        <div className="px-6 py-4 flex flex-col gap-3">
          <p className="text-xs font-bold uppercase text-[#618389] dark:text-gray-400">Periodo de Inscripción</p>
          <div className="relative pl-4 border-l-2 border-primary/30 space-y-4">
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white dark:ring-[#1a2c30]" />
              <p className="text-xs font-medium text-[#111718] dark:text-white">
                Apertura: {formatSignupDate(appDateIni)}
              </p>
              <p className="text-[10px] text-[#618389]">Disponible para miembros registrados</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-orange-400 ring-4 ring-white dark:ring-[#1a2c30]" />
              <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
                Cierre: {formatSignupDate(appDateEnd)}
              </p>
              <p className="text-[10px] text-[#618389]">Plazas limitadas</p>
            </div>
          </div>
        </div>
        <hr className="border-[#f0f4f4] dark:border-gray-700" />
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#618389] dark:text-gray-400">
              Personas inscritas
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#111718] dark:text-white">
                <span className="material-symbols-outlined text-primary text-base">group</span>
                <span className="text-2xl font-extrabold leading-none">{totalAttendees}</span>
              </div>
            </div>
          </div>
          <button
            className="flex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-primary text-[#111718] hover:bg-[#11b5d6] transition-all transform hover:scale-[1.02] shadow-lg shadow-primary/20 text-base font-bold leading-normal tracking-[0.015em]"
            onClick={onSignup}
            type="button"
          >
            Inscribirse Ahora
          </button>
          <p className="text-center text-xs text-[#618389]">Gratis para Miembros de BalearTrek</p>
        </div>
      </div>

      <div className="bg-[#f0f4f4] dark:bg-[#1a2c30] rounded-xl p-4 flex items-center gap-4 border border-transparent dark:border-[#2a3c40]">
        <div className="bg-white dark:bg-black/20 p-2 rounded-full text-[#618389]">
          <span className="material-symbols-outlined">help</span>
        </div>
        <div>
          <p className="text-sm font-bold text-[#111718] dark:text-white">¿Necesitas ayuda?</p>
          <Link className="text-xs text-primary font-medium hover:underline" to="/contacto">
            Contactar Soporte
          </Link>
        </div>
      </div>
    </div>
  )
}
