import { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { cancelMeetingSubscription } from '../../auth/api/authApi'
import { useUser } from '../../auth/hooks/useUser'
import ProfileSidebar from '../components/ProfileSidebar'
import Stars from '../../../components/Stars'
import { formatMemberSince } from '../utils/profileUtils'
import {
  formatMeetingDate,
  formatMeetingHour,
  formatMeetingRange,
  getMeetingDateValue,
  sortMeetings,
} from '../utils/profileCommentsUtils'
import { getBrowserNow } from '../../trek-details/utils/trekDetailsViewUtils'
import { resolveImageUrl } from '../../shared/utils/urls'
import { isPublishedStatus } from '../../trek-details/utils/commentsUtils'
import { clampRating, formatFullName } from '../../shared/utils/formatters'


// Muestra próximos encuentros e historial con valoraciones del usuario autenticado
export default function ProfileCommentsPage() {
  const { token } = useAuth()
  const { user, refreshUser, isUserLoading } = useUser()
  const [cancelError, setCancelError] = useState('')
  const [cancelingMeetingId, setCancelingMeetingId] = useState(null)
  const [sortKey, setSortKey] = useState('recent')

  // Cancela la asistencia a un encuentro futuro y refresca los datos del perfil
  const handleCancelMeeting = async (meetingId) => {
    if (!token) return
    const confirmed = window.confirm('¿Seguro que quieres cancelar tu asistencia?')
    if (!confirmed) return
    setCancelError('')
    setCancelingMeetingId(meetingId)
    try {
      await cancelMeetingSubscription(token, meetingId)
      await refreshUser()
    } catch (cancelError) {
      console.error('Error al cancelar asistencia:', cancelError)
      setCancelError(cancelError?.message || 'No se pudo cancelar la asistencia')
    } finally {
      setCancelingMeetingId(null)
    }
  }

  const memberSince = formatMemberSince(user?.created_at)
  const fullName = formatFullName(user)

  const meetings = user?.meetings ?? []
  const nowValue = getBrowserNow().getTime()

  const upcomingMeetings = []
  const pastMeetings = []

  meetings.forEach((meeting) => {
    const dateValue = getMeetingDateValue(meeting)
    if (!dateValue || dateValue >= nowValue) {
      upcomingMeetings.push(meeting)
    } else {
      pastMeetings.push(meeting)
    }
  })

  const sortedUpcomingMeetings = [...upcomingMeetings].sort((a, b) => {
    const dateA = getMeetingDateValue(a) || Number.MAX_SAFE_INTEGER
    const dateB = getMeetingDateValue(b) || Number.MAX_SAFE_INTEGER
    return dateA - dateB
  })

  const sortedMeetings = sortMeetings(pastMeetings, sortKey)

  return (
    <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <ProfileSidebar fullName={fullName} memberSince={memberSince} />

        <main className="flex-1 flex flex-col gap-8 max-w-4xl">
          <div className="flex flex-col gap-2">
            <h1 className="text-text-main text-4xl font-black leading-tight tracking-[-0.033em]">
              Mis Encuentros
            </h1>
            <p className="text-text-sub text-base font-normal leading-normal">
              Historial de los encuentros a los que has asistido y sus valoraciones.
            </p>
          </div>

          {isUserLoading ? (
            <div className="rounded-lg border border-[#f0f4f4] bg-[#f6f8f8] px-4 py-3 text-sm text-text-sub">
              Cargando encuentros...
            </div>
          ) : meetings.length === 0 ? (
            <div className="rounded-lg border border-[#f0f4f4] bg-[#f6f8f8] px-4 py-3 text-sm text-text-sub">
              Aún no tienes encuentros registrados.
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {cancelError ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {cancelError}
                </div>
              ) : null}
              <section className="flex flex-col gap-4">
                <div className="flex items-center gap-2 px-1">
                  <span className="material-symbols-outlined text-primary">calendar_month</span>
                  <h2 className="text-text-main text-2xl font-bold leading-tight tracking-[-0.015em]">
                    Próximos Encuentros
                  </h2>
                </div>
                {sortedUpcomingMeetings.length === 0 ? (
                  <div className="rounded-lg border border-[#f0f4f4] bg-[#f6f8f8] px-4 py-3 text-sm text-text-sub">
                    No tienes encuentros próximos.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedUpcomingMeetings.map((meeting) => {
                      const meetingName =
                        meeting?.trek_name ||
                        meeting?.trek?.name ||
                        meeting?.route?.name ||
                        `Encuentro #${meeting.id}`
                      const meetingDateLabel =
                        formatMeetingDate(meeting?.day) ||
                        formatMeetingRange(meeting?.appDateIni, meeting?.appDateEnd)

                      return (
                        <div
                          key={meeting.id}
                          className="bg-white p-5 rounded-xl border border-[#f0f4f4] shadow-sm flex flex-col gap-4"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                <span className="material-symbols-outlined">hiking</span>
                              </div>
                              <div className="flex flex-col">
                                <p className="text-text-main font-bold leading-tight">
                                  {meetingName}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1 text-text-sub text-xs">
                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                    {meetingDateLabel}
                                  </div>
                                  <div className="flex items-center gap-1 text-text-sub text-xs">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    {formatMeetingHour(meeting?.hour)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                              Inscrito
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-xs text-text-sub">
                              Guía principal:{' '}
                              <span className="font-bold text-text-main">
                                {meeting?.guide?.name ? `${meeting.guide.name} ${meeting?.guide?.lastname ?? ''}`.trim() : 'Pendiente'}
                              </span>
                            </div>
                            <button
                              className="px-3 py-2 text-xs font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                              type="button"
                              onClick={() => handleCancelMeeting(meeting.id)}
                              disabled={cancelingMeetingId === meeting.id}
                            >
                              {cancelingMeetingId === meeting.id ? 'Cancelando...' : 'Cancelar'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4 px-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-text-sub">history</span>
                    <h2 className="text-text-main text-2xl font-bold leading-tight tracking-[-0.015em]">
                      Historial de Encuentros
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-[#e3eaec] shadow-sm">
                    <span className="text-sm font-medium text-text-sub">
                      Ordenar por:
                    </span>
                    <select
                      className="bg-transparent border-none text-sm font-bold text-text-main focus:ring-0 cursor-pointer py-0 pl-0 pr-8"
                      onChange={({ target }) => setSortKey(target.value)}
                      value={sortKey}
                    >
                      <option value="recent">Más recientes</option>
                      <option value="best">Mejor valorados</option>
                    </select>
                  </div>
                </div>
                {sortedMeetings.length === 0 ? (
                  <div className="rounded-lg border border-[#f0f4f4] bg-[#f6f8f8] px-4 py-3 text-sm text-text-sub">
                    Aún no tienes encuentros en el historial.
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {sortedMeetings.map((meeting) => {
                      const comments = meeting?.comments ?? []
                      const publishedComment = comments.find((comment) => isPublishedStatus(comment?.status))
                      const selectedComment = publishedComment ?? comments[0] ?? null
                      const statusLabel = publishedComment ? 'Publicado' : 'Pendiente'
                      const statusTone = publishedComment ? 'text-primary' : 'text-text-sub'
                      const cardOpacity = publishedComment ? '' : 'opacity-80'
                      const ratingValue =
                        selectedComment?.score ?? meeting?.score?.average ?? meeting?.score?.total ?? 0
                      const coverImage = resolveImageUrl(selectedComment?.image?.url)
                      const rating = clampRating(ratingValue)

                      const meetingName =
                        meeting?.trek_name ||
                        meeting?.trek?.name ||
                        meeting?.route?.name ||
                        `Encuentro #${meeting.id}`
                      const meetingDateLabel =
                        formatMeetingDate(meeting?.day) ||
                        formatMeetingRange(meeting?.appDateIni, meeting?.appDateEnd)

                      return (
                        <div
                          key={meeting.id}
                          className={`bg-white rounded-xl border border-[#f0f4f4] overflow-hidden shadow-sm ${cardOpacity}`}
                        >
                          <div className="p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                              <div className="flex items-center gap-4">
                                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                  <span className="material-symbols-outlined">event</span>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-text-main font-bold leading-tight">
                                    {meetingName}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center gap-1 text-text-sub text-xs">
                                      <span className="material-symbols-outlined text-sm">
                                        calendar_today
                                      </span>
                                      {meetingDateLabel}
                                    </div>
                                    <div className="flex items-center gap-1 text-text-sub text-xs">
                                      <span className="material-symbols-outlined text-sm">schedule</span>
                                      {formatMeetingHour(meeting?.hour)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                Completado
                              </span>
                            </div>
                            <hr className="border-[#f0f4f4] mb-6" />

                            {selectedComment ? (
                              <div className="bg-background-light p-5 rounded-lg border border-[#f0f4f4]">
                                <div className="flex justify-between items-start mb-4">
                                  <h3 className="text-sm font-bold text-text-main">
                                    Mi Valoración
                                  </h3>
                                  <div
                                    className={`flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded border border-primary/20 ${statusTone}`}
                                  >
                                    <span className="material-symbols-outlined text-[14px]">
                                      check_circle
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                      {statusLabel}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                  <div className="flex-1 flex flex-col gap-3">
                                    <div className="flex gap-1 items-center text-orange-400">
                                      <Stars id={`meeting-${meeting.id}`} rating={rating} max={5} />
                                      <span className="ml-2 text-text-main text-sm font-bold">
                                        {rating}/5
                                      </span>
                                    </div>
                                    {selectedComment?.comment ? (
                                      <p className="text-text-sub text-sm italic leading-relaxed">
                                        &quot;{selectedComment.comment}&quot;
                                      </p>
                                    ) : null}
                                  </div>
                                  {coverImage ? (
                                    <div className="shrink-0">
                                      <div
                                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-24 border-2 border-white shadow-sm"
                                        style={{ backgroundImage: `url("${coverImage}")` }}
                                      />
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            ) : (
                              <div className="rounded-lg border border-[#f0f4f4] bg-[#f6f8f8] px-4 py-3 text-sm text-text-sub">
                                Aún no has dejado una valoración de este encuentro.
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            </div>
          )}

          <div className="h-10" />
        </main>
      </div>
    </div>
  )
}
