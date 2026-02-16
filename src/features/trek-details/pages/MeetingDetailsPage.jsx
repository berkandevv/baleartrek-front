import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { useMeetingSubscription } from '../hooks/useMeetingSubscription'
import { useTrekDetailsData } from '../hooks/useTrekDetailsData'
import TrekDetailsPageState from '../components/TrekDetailsPageState'
import Stars from '../../../components/Stars'
import { getBrowserNow } from '../utils/trekDetailsViewUtils'
import { getMeetingViewModel } from '../utils/meetingViewModel'

// Formatea una fecha larga legible para el bloque de resumen del encuentro
const formatLongDate = (value) => {
  if (!value) return 'Fecha pendiente'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Fecha pendiente'
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

// Renderiza la vista detallada de un encuentro con estado de inscripción y métricas
export default function MeetingDetailsPage() {
  const { regNumber, meetingId } = useParams()
  const { token, isAuthenticated, user } = useAuth()
  const { trek, isLoading, error, fetchTrek } = useTrekDetailsData(regNumber)
  const { subscribeError, activeMeetingId, handleToggleSubscription } = useMeetingSubscription({
    isAuthenticated,
    token,
    onSuccess: fetchTrek,
  })

  if (isLoading) {
    return <TrekDetailsPageState message="Cargando detalles del encuentro..." />
  }

  if (error) {
    return <TrekDetailsPageState tone="error" message={error || 'No se encontró el trek solicitado.'} />
  }

  if (!trek) {
    return <TrekDetailsPageState tone="warning" message="No se encontró el trek solicitado." />
  }

  const meeting = (trek?.meetings ?? []).find((item) => String(item?.id) === String(meetingId))
  if (!meeting) {
    return <TrekDetailsPageState tone="warning" message="No se encontró el encuentro solicitado." />
  }

  const municipalityName = trek?.municipality?.name ?? 'Municipio pendiente'
  const islandName = trek?.municipality?.island?.name ?? 'Isla pendiente'
  const trekName = trek?.name ?? 'Ruta sin nombre'
  const now = getBrowserNow()
  const currentUserId = user?.id ?? user?.user_id
  const viewModel = getMeetingViewModel(meeting, {
    currentUserId,
    now,
    activeMeetingId,
  })
  const commentsCount = (meeting?.comments ?? []).length
  const averageScore = Number(meeting?.score?.average)
  const averageScoreLabel = Number.isFinite(averageScore) ? averageScore.toFixed(1) : '0.0'

  return (
    <main className="flex-1 w-full py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20">
        <header className="w-full bg-white border border-[#f0f4f4] rounded-[2rem] pt-10 pb-10 px-6 md:px-10 mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-[#111718] tracking-tighter leading-none mb-4">
            {trekName}
          </h1>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-sm font-bold text-[#618389]">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {municipalityName}, {islandName}
            </span>
          </div>
        </header>

        {subscribeError ? (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {subscribeError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white rounded-[2rem] p-8 md:p-10 border border-[#f0f4f4]">
              <div className="flex items-center gap-3 mb-8">
                <span className="p-2 bg-blue-50 text-corporate-blue rounded-xl">
                  <span className="material-symbols-outlined font-bold">event_note</span>
                </span>
                <h2 className="text-2xl font-black tracking-tight">Resumen del Encuentro</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <div>
                    <span className="block text-[10px] font-black text-[#618389] uppercase tracking-[0.2em] mb-1">
                      Código Registro
                    </span>
                    <span className="text-xl font-bold font-mono">{trek?.regNumber ?? '-'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-[#618389] uppercase tracking-[0.2em] mb-1">
                      Municipio / Isla
                    </span>
                    <span className="text-lg font-bold">{municipalityName}, {islandName}</span>
                  </div>
                </div>
                <div className="md:col-span-2 flex items-center gap-8 bg-background-light p-6 rounded-3xl">
                  <div className="flex-none text-center border-r border-gray-200 pr-8">
                    <span className="block text-4xl font-black text-corporate-blue leading-none">{viewModel.day}</span>
                    <span className="block text-xs font-black uppercase tracking-widest mt-1">{viewModel.monthYear}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-corporate-blue">schedule</span>
                      <span className="text-2xl font-black tracking-tighter">{viewModel.time}</span>
                    </div>
                    <p className="text-xs font-bold text-[#618389]">{formatLongDate(meeting?.day)}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[2rem] p-8 md:p-10 border border-[#f0f4f4]">
              <div className="flex items-center gap-3 mb-8">
                <span className="p-2 bg-blue-50 text-corporate-blue rounded-xl">
                  <span className="material-symbols-outlined font-bold">groups</span>
                </span>
                <h2 className="text-2xl font-black tracking-tight">Organización</h2>
              </div>
              <div className="flex items-center gap-6">
                <div className="size-16 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-4xl text-[#618389]">account_circle</span>
                </div>
                <div>
                  <span className="block text-[10px] font-black text-[#618389] uppercase tracking-[0.2em] mb-1">
                    Guía Principal
                  </span>
                  <h3 className="text-xl font-black text-corporate-blue uppercase">{viewModel.guideLabel}</h3>
                  <p className="text-sm text-[#618389] mt-1 italic">
                    No hay guías adicionales asignados para esta salida.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[2rem] p-8 md:p-10 border border-[#f0f4f4]">
              <div className="flex items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-blue-50 text-corporate-blue rounded-xl">
                    <span className="material-symbols-outlined font-bold">assignment_turned_in</span>
                  </span>
                  <h2 className="text-2xl font-black tracking-tight">Inscripciones</h2>
                </div>
                <span
                  className={`px-5 py-2 text-xs font-black rounded-full uppercase tracking-widest flex items-center gap-2 ${
                    viewModel.isApplicationOpen
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  <span className={`size-2 rounded-full ${viewModel.isApplicationOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                  {viewModel.isApplicationOpen ? 'Inscripción Abierta' : 'Inscripción Cerrada'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative pl-6 border-l-2 border-gray-100">
                  <span className="block text-[10px] font-black text-[#618389] uppercase tracking-[0.2em] mb-2">
                    Inicio del plazo
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-green-600">{viewModel.openingDate}</span>
                  </div>
                </div>
                <div className="relative pl-6 border-l-2 border-gray-100">
                  <span className="block text-[10px] font-black text-[#618389] uppercase tracking-[0.2em] mb-2">
                    Fin del plazo
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-red-500">{viewModel.closingDate}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[2rem] p-8 md:p-10 border border-[#f0f4f4]">
              <div className="flex items-center gap-3 mb-8">
                <span className="p-2 bg-blue-50 text-corporate-blue rounded-xl">
                  <span className="material-symbols-outlined font-bold">query_stats</span>
                </span>
                <h2 className="text-2xl font-black tracking-tight">Participación</h2>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-background-light p-6 rounded-2xl text-center">
                  <span className="block text-3xl font-black mb-1">{viewModel.attendeeCount}</span>
                  <span className="block text-[10px] font-black text-[#618389] uppercase tracking-widest leading-tight">
                    Asistentes Confirmados
                  </span>
                </div>
                <div className="bg-background-light p-6 rounded-2xl text-center">
                  <span className="block text-3xl font-black mb-1">{commentsCount}</span>
                  <span className="block text-[10px] font-black text-[#618389] uppercase tracking-widest leading-tight">
                    Comentarios Recibidos
                  </span>
                </div>
                <div className="bg-background-light p-6 rounded-2xl text-center">
                  <div className="mb-2 flex justify-center">
                    <Stars
                      id={`meeting-details-score-${meeting.id}`}
                      rating={Number.isFinite(averageScore) ? averageScore : 0}
                      max={5}
                      className="text-[22px] leading-none"
                    />
                  </div>
                  <span className="block text-xs font-bold text-[#618389]">{averageScoreLabel}/5</span>
                  <span className="block text-[10px] font-black text-[#618389] uppercase tracking-widest leading-tight">
                    Puntuación Media
                  </span>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-[#f0f4f4]">
                <button
                  className={`w-full py-5 font-black rounded-2xl text-lg transition-all flex items-center justify-center gap-3 ${
                    viewModel.isClosed
                      ? 'bg-slate-200 text-slate-700'
                      : viewModel.isSubscribed
                        ? 'bg-rose-600 text-white hover:bg-rose-700'
                        : 'bg-corporate-blue text-white hover:bg-blue-700'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                  type="button"
                  onClick={() =>
                    handleToggleSubscription(meeting.id, viewModel.isSubscribed, viewModel.isGuide)
                  }
                  disabled={viewModel.isDisabled}
                >
                  <span className="material-symbols-outlined font-bold">how_to_reg</span>
                  {viewModel.actionLabel}
                </button>
                <Link
                  className="mt-6 block px-4 text-center text-[11px] font-medium leading-relaxed text-[#618389] underline decoration-[#bcdde4] underline-offset-2 transition hover:text-corporate-blue"
                  to="/faq"
                >
                  Al inscribirte aceptas los términos de participación y la normativa de seguridad de BalearTrek.
                </Link>
              </div>

              <Link
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[#d8edf2] bg-white px-6 py-4 text-sm font-black text-corporate-blue transition hover:bg-[#f6fcff]"
                to={`/treks/${encodeURIComponent(regNumber)}`}
              >
                Volver al detalle de la excursión
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
