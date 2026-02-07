import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import ProfileSidebar from '../components/ProfileSidebar'
import Stars from '../components/Stars'
import { formatMemberSince, getFullName } from '../utils/profileUtils'
import {
  clampRating,
  formatMeetingDate,
  formatMeetingHour,
  formatMeetingRange,
  sortMeetings,
} from '../utils/profileCommentsUtils'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
const buildUrl = (path) => (API_BASE_URL ? `${API_BASE_URL}${path}` : path)


export default function ProfileCommentsPage() {
  const { token } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [sortKey, setSortKey] = useState('recent')

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }

    let isActive = true
    const fetchMeetings = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await fetch(buildUrl('/api/user'), {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload?.message || 'No se pudo cargar el historial')
        }
        if (isActive) {
          setUser(payload?.data ?? null)
        }
      } catch (fetchError) {
        console.error('Error al cargar encuentros:', fetchError)
        if (isActive) {
          setError(fetchError?.message || 'No se pudo cargar el historial')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    fetchMeetings()

    return () => {
      isActive = false
    }
  }, [token])

  const memberSince = formatMemberSince(user?.created_at)
  const fullName = getFullName(user)

  const meetings = user?.meetings ?? []
  const sortedMeetings = sortMeetings(meetings, sortKey)

  return (
    <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <ProfileSidebar fullName={fullName} memberSince={memberSince} />

        <main className="flex-1 flex flex-col gap-8 max-w-4xl">
          <div className="flex flex-col gap-2">
            <h1 className="text-text-main dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Mis Encuentros
            </h1>
            <p className="text-text-sub text-base font-normal leading-normal">
              Historial de los encuentros a los que has asistido y sus valoraciones.
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-lg border border-[#f0f4f4] dark:border-white/10 bg-[#f6f8f8] dark:bg-white/5 px-4 py-3 text-sm text-text-sub">
              Cargando encuentros...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : meetings.length === 0 ? (
            <div className="rounded-lg border border-[#f0f4f4] dark:border-white/10 bg-[#f6f8f8] dark:bg-white/5 px-4 py-3 text-sm text-text-sub">
              Aún no tienes encuentros registrados.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4 px-1">
                <h2 className="text-text-main dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  Encuentros Realizados
                </h2>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/10 rounded-lg border border-[#e3eaec] dark:border-white/20 shadow-sm">
                  <span className="text-sm font-medium text-text-sub dark:text-gray-400">
                    Ordenar por:
                  </span>
                  <select
                    className="bg-transparent border-none text-sm font-bold text-text-main dark:text-white focus:ring-0 cursor-pointer py-0 pl-0 pr-8"
                    onChange={({ target }) => setSortKey(target.value)}
                    value={sortKey}
                  >
                    <option value="recent">Más recientes</option>
                    <option value="best">Mejor valorados</option>
                  </select>
                </div>
              </div>
              {sortedMeetings.map((meeting) => {
                const comments = meeting?.comments ?? []
                const publishedComment = comments.find((comment) => comment.status === 'y') ?? comments[0]
                const statusLabel = publishedComment ? 'Publicado' : 'Pendiente'
                const statusTone = publishedComment ? 'text-primary' : 'text-text-sub'
                const cardOpacity = publishedComment ? '' : 'opacity-80'
                const ratingValue =
                  publishedComment?.score ?? meeting?.score?.average ?? meeting?.score?.total ?? 0
                const coverImage = publishedComment?.image?.url
                const rating = clampRating(ratingValue)

                const meetingDateLabel = formatMeetingRange(meeting?.appDateIni, meeting?.appDateEnd)

                return (
                  <div
                    key={meeting.id}
                    className={`bg-white dark:bg-white/5 rounded-xl border border-[#f0f4f4] dark:border-white/10 overflow-hidden shadow-sm ${cardOpacity}`}
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 text-primary p-2 rounded-lg">
                            <span className="material-symbols-outlined">event</span>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-text-main dark:text-white font-bold leading-tight">
                              {meeting?.trek_name ||
                                meeting?.trek?.name ||
                                meeting?.route?.name ||
                                `Encuentro #${meeting.id}`}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1 text-text-sub text-xs">
                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                {meetingDateLabel || formatMeetingDate(meeting?.day)}
                              </div>
                              <div className="flex items-center gap-1 text-text-sub text-xs">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                {formatMeetingHour(meeting?.hour)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 text-xs font-bold rounded-full">
                          Completado
                        </span>
                      </div>
                      <hr className="border-[#f0f4f4] dark:border-white/10 mb-6" />

                      {publishedComment ? (
                        <div className="bg-background-light dark:bg-white/5 p-5 rounded-lg border border-[#f0f4f4] dark:border-white/10">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-sm font-bold text-text-main dark:text-white">Mi Valoración</h3>
                            <div
                              className={`flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-primary/10 rounded border border-primary/20 ${statusTone}`}
                            >
                              <span className="material-symbols-outlined text-[14px] filled">check_circle</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider">{statusLabel}</span>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 flex flex-col gap-3">
                              <div className="flex gap-1 items-center">
                                <Stars id={`meeting-${meeting.id}`} rating={rating} max={5} />
                              </div>
                              {publishedComment?.comment ? (
                                <p className="text-text-sub text-sm italic leading-relaxed">
                                  &quot;{publishedComment.comment}&quot;
                                </p>
                              ) : null}
                            </div>
                            {coverImage ? (
                              <div className="shrink-0">
                                <div
                                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-24 border-2 border-white dark:border-white/10 shadow-sm"
                                  style={{ backgroundImage: `url("${coverImage}")` }}
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-[#f0f4f4] dark:border-white/10 bg-[#f6f8f8] dark:bg-white/5 px-4 py-3 text-sm text-text-sub">
                          Aún no has dejado una valoración de este encuentro.
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="h-10" />
        </main>
      </div>
    </div>
  )
}
