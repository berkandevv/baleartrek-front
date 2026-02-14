import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { useAuth } from '../auth/AuthContext'
import {
  formatFullName,
  formatApplicationDate,
  formatMeetingDateParts,
  getBrowserNow,
  isApplicationOpenToday,
  isMeetingActive,
} from '../utils/trekDetailsViewUtils'
import { resolveImageUrl } from '../utils/urls'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
const buildUrl = (path) => (API_BASE_URL ? `${API_BASE_URL}${path}` : path)

const buildTrekEndpoint = (regNumber) => buildUrl(`/api/treks/${encodeURIComponent(regNumber)}`)

const FitMapToMarkers = ({ markers, onReady }) => {
  const map = useMap()

  useEffect(() => {
    if (onReady) {
      onReady(map)
    }
    if (!markers.length) return
    const bounds = markers.map((marker) => [marker.lat, marker.lng])
    map.fitBounds(bounds, { padding: [32, 32] })
  }, [map, markers, onReady])

  useEffect(() => {
    const handleResize = () => map.invalidateSize()
    const timer = setTimeout(() => map.invalidateSize(), 0)
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [map])

  return null
}

export default function TrekDetailsPage() {
  const { regNumber } = useParams()
  const navigate = useNavigate()
  const { token, isAuthenticated, user } = useAuth()
  const [trek, setTrek] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [subscribeError, setSubscribeError] = useState('')
  const [activeMeetingId, setActiveMeetingId] = useState(null)
  const [visibleComments, setVisibleComments] = useState(4)
  const carouselRef = useRef(null)
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 })
  const mapRef = useRef(null)
  const markerRefs = useRef({})

  const meetings = trek?.meetings ?? []
  const places = trek?.interesting_places ?? []
  const mapMarkers = places
    .map((place) => {
      const [latRaw, lngRaw] = place.gps.split(',').map((value) => value.trim())
      const lat = Number(latRaw)
      const lng = Number(lngRaw)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
      return { ...place, lat, lng }
    })
    .filter(Boolean)
  const mapCenter = mapMarkers.length
    ? [
        mapMarkers.reduce((sum, place) => sum + place.lat, 0) / mapMarkers.length,
        mapMarkers.reduce((sum, place) => sum + place.lng, 0) / mapMarkers.length,
      ]
    : [39.6, 2.9]
  const sortedMeetings = [...meetings].sort((a, b) => {
    const dateA = new Date(`${a.day}T${a.hour}`).getTime()
    const dateB = new Date(`${b.day}T${b.hour}`).getTime()
    return dateB - dateA
  })
  const comments = meetings
    .flatMap((meeting) =>
      (meeting.comments ?? [])
        .filter((comment) => String(comment?.status ?? '').toLowerCase() === 'y')
        .map((comment) => ({
          ...comment,
          meetingDay: meeting.day,
        })),
    )
  const hasMoreComments = comments.length > 4
  const shownComments = comments.slice(0, visibleComments)

  const fetchTrek = async () => {
    setIsLoading(true)
    try {
      setError('')
      const response = await fetch(buildTrekEndpoint(regNumber))
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? 'No se encontró el trek solicitado.'
            : 'No se pudo cargar este trek. Intenta de nuevo más tarde.',
        )
      }
      const trekData = payload?.data
      if (trekData?.status === 'y') {
        setTrek(trekData)
      } else {
        setTrek(null)
        setError('No se encontró el trek solicitado.')
      }
    } catch (error) {
      console.error('Error al cargar el trek:', error)
      setError(error?.message || 'No se pudo cargar este trek. Intenta de nuevo más tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrek()
  }, [regNumber])

  if (isLoading) {
    return (
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-10">
        <div className="bg-white dark:bg-[#1a2c30] rounded-xl border border-[#dbe4e6] dark:border-[#2a3c40] p-8 text-center">
          <p className="text-sm text-text-muted">Cargando detalles del trek...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-10">
        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-900/40 p-8 text-center">
          <p className="text-sm text-rose-700 dark:text-rose-200">{error || 'No se encontró el trek solicitado.'}</p>
        </div>
      </main>
    )
  }

  if (!trek) {
    return (
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-10">
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-900/40 p-8 text-center">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            No se encontró el trek solicitado.
          </p>
        </div>
      </main>
    )
  }

  const averageScore = trek.score?.average ?? 0
  const scoreCount = trek.score?.count ?? 0
  const averageScoreLabel = Number.isFinite(averageScore) ? averageScore.toFixed(2) : '0.00'
  const imageSrc = resolveImageUrl(trek.imageUrl)
  const locationLabel = `${trek.municipality.name}, ${trek.municipality.island.name}`

  const aboutParagraphs = [
    trek.description,
    `La ruta transcurre por ${trek.municipality.name}, zona ${trek.municipality.zone.name}, en la isla de ${trek.municipality.island.name}.`,
  ]

  const now = getBrowserNow()
  const defaultIcon = new Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
  const scrollCarouselBy = (offset) => {
    if (!carouselRef.current) return
    carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  const handlePointerDown = (event) => {
    const container = carouselRef.current
    if (!container) return
    if (event.target.closest('button')) return
    container.setPointerCapture(event.pointerId)
    container.classList.add('carousel-dragging')
    dragState.current.isDragging = true
    dragState.current.startX = event.clientX
    dragState.current.scrollLeft = container.scrollLeft
  }

  const handlePointerMove = (event) => {
    const container = carouselRef.current
    if (!container || !dragState.current.isDragging) return
    const deltaX = event.clientX - dragState.current.startX
    container.scrollLeft = dragState.current.scrollLeft - deltaX
  }

  const handlePointerUp = (event) => {
    const container = carouselRef.current
    if (!container) return
    container.releasePointerCapture(event.pointerId)
    container.classList.remove('carousel-dragging')
    dragState.current.isDragging = false
  }

  const focusPlaceOnMap = (place) => {
    if (!mapRef.current) return
    mapRef.current.setView([place.lat, place.lng], 12, { animate: true })
    const marker = markerRefs.current[place.id]
    if (marker) {
      marker.openPopup()
    }
  }

  const handleMapReady = (mapInstance) => {
    mapRef.current = mapInstance
  }

  const getAttendeeId = (attendee) => attendee?.id ?? attendee?.user_id ?? attendee?.pivot?.user_id
  const currentUserId = user?.id ?? user?.user_id
  const getGuideId = (meeting) => meeting?.guide?.id ?? meeting?.guide?.user_id
  const isCurrentUserGuide = (meeting) =>
    Boolean(currentUserId) && String(getGuideId(meeting)) === String(currentUserId)
  const getAttendeeCount = (meeting) => {
    const guideId = getGuideId(meeting)
    const attendees = meeting?.attendees ?? []
    if (!guideId) return attendees.length
    return attendees.filter((attendee) => String(getAttendeeId(attendee)) !== String(guideId)).length
  }
  const totalAttendees = meetings.reduce((total, meeting) => total + getAttendeeCount(meeting), 0)

  const handleToggleSubscription = async (meetingId, isSubscribed, isGuide) => {
    if (!isAuthenticated || !token) {
      navigate('/login')
      return
    }
    if (isGuide) {
      window.alert('Como guía de este encuentro no puedes inscribirte.')
      return
    }
    if (isSubscribed) {
      const confirmed = window.confirm('¿Estás seguro de cancelar tu asistencia?')
      if (!confirmed) return
    }
    setSubscribeError('')
    setActiveMeetingId(meetingId)
    try {
      const response = await fetch(buildUrl(`/api/meetings/${meetingId}/subscribe`), {
        method: isSubscribed ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.message || 'No se pudo actualizar la suscripción')
      }
      await fetchTrek()
    } catch (subscribeError) {
      console.error('Error al actualizar suscripción:', subscribeError)
      setSubscribeError(subscribeError?.message || 'No se pudo actualizar la suscripción')
    } finally {
      setActiveMeetingId(null)
    }
  }

  return (
    <main className="flex-1 w-full">
      <section className="relative w-full h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{ backgroundImage: `url('${imageSrc}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-10 lg:px-20 pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 text-base md:text-lg font-bold text-white/90">
                <span className="material-symbols-outlined text-[22px] text-primary">location_on</span>
                {locationLabel}
              </span>
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full">
                <div className="flex text-orange-400">
                  <span className="material-symbols-outlined star-rating text-xl">star</span>
                  <span className="material-symbols-outlined star-rating text-xl">star</span>
                  <span className="material-symbols-outlined star-rating text-xl">star</span>
                  <span className="material-symbols-outlined star-rating text-xl">star</span>
                  <span className="material-symbols-outlined star-rating text-xl">star</span>
                </div>
                <span className="text-base font-black text-white">
                  {averageScoreLabel}/5
                  <span className="ml-2 text-xs font-semibold text-white/70">({scoreCount})</span>
                </span>
              </div>
            </div>
            <h1 className="text-white text-4xl md:text-6xl font-black leading-[0.95] tracking-tighter mb-6 max-w-4xl drop-shadow-2xl">
              {trek.name}
            </h1>
            <p className="text-white/80 text-lg md:text-2xl max-w-2xl font-light leading-relaxed italic border-l-4 border-primary pl-5">
              {trek.description}
            </p>
          </div>
        </div>
      </section>

      <div className="w-full space-y-16 py-12">
        <article className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 text-primary mb-6">
              <span className="h-px w-12 bg-primary" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Crónica de Ruta</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black dark:text-white mb-6 leading-tight">Resumen de la Ruta</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-text-muted dark:text-gray-300 leading-relaxed space-y-6">
              <p className="text-lg md:text-xl font-light text-text-main dark:text-gray-100 first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                {aboutParagraphs[0]}
              </p>
              <p className="text-base md:text-lg">{aboutParagraphs[1]}</p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-background-light dark:bg-[#1a2c30] p-8 rounded-[1.75rem] editorial-shadow border border-[#f0f4f4] dark:border-[#2a3c40]">
              <div className="grid grid-cols-2 gap-y-8">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">
                    Puntuación media
                  </span>
                  <span className="text-2xl md:text-3xl font-black dark:text-white tracking-tighter">
                    {averageScoreLabel}/5
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">
                    Valoraciones
                  </span>
                  <span className="text-2xl md:text-3xl font-black dark:text-white tracking-tighter">
                    {scoreCount}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">
                    Encuentros
                  </span>
                  <span className="text-2xl md:text-3xl font-black dark:text-white tracking-tighter">
                    {meetings.length}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">
                    Participantes
                  </span>
                  <span className="text-2xl md:text-3xl font-black dark:text-white tracking-tighter">
                    {totalAttendees}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        <section
          className="w-full bg-[#f9fafb] dark:bg-[#132226] py-12 overflow-hidden"
          id="proximos-encuentros"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 text-primary mb-4">
                  <span className="h-px w-12 bg-primary" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Agenda de la Comunidad</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black dark:text-white leading-tight">Próximos Encuentros</h2>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-primary">{sortedMeetings.length}</span>
                  <span className="text-[10px] font-bold text-text-muted uppercase leading-tight">
                    Fechas
                    <br />
                    Registradas
                  </span>
                </div>
                <div className="hidden md:flex gap-3">
                  <button
                    className="size-11 rounded-full border-2 border-primary text-primary flex items-center justify-center hover:bg-primary/10 transition-all shadow-lg active:scale-90"
                    onClick={() => scrollCarouselBy(-360)}
                    type="button"
                    aria-label="Desplazar encuentros a la izquierda"
                  >
                    <span className="material-symbols-outlined font-bold">arrow_back</span>
                  </button>
                  <button
                    className="size-11 rounded-full bg-primary text-[#0f2a33] flex items-center justify-center hover:bg-[#0fb6d8] transition-all shadow-lg active:scale-90"
                    onClick={() => scrollCarouselBy(360)}
                    type="button"
                    aria-label="Desplazar encuentros a la derecha"
                  >
                    <span className="material-symbols-outlined font-bold">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
            {subscribeError ? (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {subscribeError}
              </div>
            ) : null}
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20">
            <div className="relative group overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f9fafb]/90 to-transparent dark:from-[#132226]/90" />
              <div
                className="no-scrollbar flex overflow-x-auto gap-5 py-6 snap-x snap-mandatory cursor-grab active:cursor-grabbing"
                ref={carouselRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                {sortedMeetings.map((meeting, index) => {
                  const { day, monthYear, time } = formatMeetingDateParts(meeting)
                  const isActive = isMeetingActive(meeting, now)
                  const isClosed = !isActive
                  const isApplicationOpen = isApplicationOpenToday(meeting, now)
                  const isFeatured = isApplicationOpen
                  const isGuide = isCurrentUserGuide(meeting)
                  const isSubscribed =
                    Boolean(currentUserId) &&
                    !isGuide &&
                    (meeting.attendees ?? []).some(
                      (attendee) => String(getAttendeeId(attendee)) === String(currentUserId),
                    )
                  const isPending = activeMeetingId === meeting.id
                  const isDisabled = isPending || isGuide || isClosed || !isApplicationOpen
                  const openingDate = formatApplicationDate(meeting.appDateIni)
                  const closingDate = formatApplicationDate(meeting.appDateEnd)
                  return (
                    <div
                      className={`flex-none ${isFeatured ? 'w-80' : 'w-72'} snap-center ${
                        isActive ? '' : 'opacity-60 grayscale'
                      }`}
                      key={meeting.id}
                    >
                      <div
                        className={`bg-white dark:bg-[#1a2c30] ${
                          isFeatured ? 'p-7 rounded-[2rem] border-4 border-corporate-blue' : 'p-6 rounded-[1.5rem] border border-gray-100 dark:border-[#2a3c40]'
                        } editorial-shadow h-full`}
                      >
                        <div className={`${isFeatured ? 'text-corporate-blue' : 'text-primary'} mb-6 flex justify-between items-start`}>
                          <div>
                            <span className={`${isFeatured ? 'text-4xl' : 'text-3xl'} font-black leading-none`}>{day}</span>
                            <span className={`block text-xs font-bold uppercase tracking-widest ${isFeatured ? 'mt-2' : 'mt-1'}`}>
                              {monthYear}
                            </span>
                          </div>
                          <span className="px-3 py-1 bg-primary/10 text-corporate-blue text-[10px] font-black rounded-full uppercase">
                            {getAttendeeCount(meeting)} participantes
                          </span>
                        </div>
                        <div className={`${isFeatured ? 'space-y-4 mb-8' : 'space-y-3 mb-6'}`}>
                          <div className="flex items-center gap-3">
                            <span className={`material-symbols-outlined ${isFeatured ? 'text-xl text-corporate-blue' : 'text-base text-text-muted'}`}>
                              schedule
                            </span>
                            <span className={`${isFeatured ? 'text-base font-black tracking-tight' : 'text-xs font-bold'}`}>
                              {time}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`material-symbols-outlined ${isFeatured ? 'text-xl text-corporate-blue' : 'text-base text-text-muted'}`}>
                              person_pin
                            </span>
                            <span className="text-xs text-text-muted">
                              Guía: <span className="font-black text-text-main dark:text-white uppercase">{formatFullName(meeting.guide)}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 py-4 border-y-2 border-corporate-blue/10">
                          <div className="flex items-center gap-3 text-xs font-bold text-corporate-blue/80 uppercase">
                            <span className="material-symbols-outlined text-lg text-green-500">calendar_today</span>
                            Apertura: {openingDate}
                          </div>
                          <div className="flex items-center gap-3 text-xs font-bold text-corporate-blue/80 uppercase">
                            <span className="material-symbols-outlined text-lg text-red-500">event_busy</span>
                            Cierre: {closingDate}
                          </div>
                        </div>
                        <button
                          className={`w-full mt-4 ${
                            isClosed
                              ? 'py-3 bg-slate-200 text-slate-700 font-black rounded-xl text-xs'
                              : isSubscribed
                              ? 'py-3 bg-rose-600 text-white font-black rounded-xl text-xs hover:bg-rose-700'
                              : isFeatured
                                ? 'py-4 bg-primary text-[#0f2a33] font-black rounded-xl text-sm hover:bg-[#0fb6d8]'
                                : 'py-3 bg-white/80 dark:bg-[#203438] border-2 border-primary text-primary font-black rounded-xl text-xs hover:bg-primary/10'
                          } transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
                          type="button"
                          onClick={() => handleToggleSubscription(meeting.id, isSubscribed, isGuide)}
                          disabled={isDisabled}
                        >
                          {isGuide
                            ? 'ERES EL GUÍA'
                            : isPending
                              ? 'PROCESANDO...'
                              : isClosed
                                ? 'ENCUENTRO FINALIZADO'
                                : isSubscribed
                                  ? 'CANCELAR ASISTENCIA'
                                  : isFeatured
                                    ? 'UNIRSE AHORA'
                                    : 'UNIRSE AHORA'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="flex items-center gap-3 text-primary mb-6">
              <span className="h-px w-12 bg-primary" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Hitos en el Camino</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black dark:text-white mb-6 leading-tight">Lugares de Interés</h2>
            <p className="text-base md:text-lg text-text-muted leading-relaxed mb-8 font-medium">
              Explora los puntos estratégicos que definen la esencia de la ruta, desde cumbres míticas hasta calas escondidas.
            </p>
            <div className="relative w-full aspect-[4/3] rounded-[1.75rem] bg-gray-100 dark:bg-[#1a2c30] overflow-hidden shadow-xl border-2 border-white dark:border-[#2a3c40]">
              <MapContainer
                center={mapCenter}
                zoom={12}
                scrollWheelZoom={false}
                className="absolute inset-0 h-full w-full"
                ref={mapRef}
              >
                <FitMapToMarkers markers={mapMarkers} onReady={handleMapReady} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mapMarkers.map((place) => (
                  <Marker
                    key={place.id}
                    position={[place.lat, place.lng]}
                    icon={defaultIcon}
                    ref={(marker) => {
                      if (marker) {
                        markerRefs.current[place.id] = marker
                      }
                    }}
                  >
                    <Popup autoPan={false}>
                      <div className="text-sm font-semibold">{place.name}</div>
                      <div className="text-xs text-gray-500">{place.place_type.name}</div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-7">
            {mapMarkers.map((place) => (
              <button
                className="group flex gap-6 p-6 bg-white dark:bg-[#1a2c30] rounded-[2rem] editorial-shadow border border-transparent hover:border-primary/20 transition-all text-left w-full"
                key={place.id}
                type="button"
                onClick={() => focusPlaceOnMap(place)}
                aria-label={`Enfocar ${place.name} en el mapa`}
              >
                <div className="flex-none size-14 rounded-2xl bg-[#101f22] text-white flex items-center justify-center font-black text-xl group-hover:bg-primary group-hover:text-corporate-blue transition-colors">
                  {String(place.order).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <h4 className="text-xl font-black dark:text-white">{place.name}</h4>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-[0.2em]">
                      {place.place_type.name}
                    </span>
                  </div>
                  <p className="text-base text-text-muted dark:text-gray-400 mb-6 leading-relaxed">
                    {place.place_type.name} destacado en la ruta, ideal para disfrutar del entorno y descansar.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-background-light dark:bg-[#203438] rounded-lg text-xs font-mono text-primary font-bold">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {place.gps}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20">
          <div className="bg-background-light dark:bg-[#1a2c30] rounded-[2.5rem] p-10 md:p-14 editorial-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-primary/15">
              <span className="material-symbols-outlined text-[9rem] leading-none">forum</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 text-primary mb-6">
                <span className="h-px w-12 bg-primary" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Testimonios</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black mb-10 dark:text-white tracking-tighter">
                Comentarios de la Comunidad
              </h3>
              {comments.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {shownComments.map((comment) => (
                    <div className="relative pl-8 border-l-4 border-primary/20" key={comment.id}>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <span className="block font-black text-base tracking-tight">
                            {formatFullName(comment.user)}
                          </span>
                          <span className="text-xs text-corporate-blue uppercase font-black tracking-widest">
                            Comentario verificado
                          </span>
                        </div>
                        <div className="flex text-orange-400">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span
                              className="material-symbols-outlined star-rating"
                              key={`${comment.id}-star-${index}`}
                            >
                              star
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-base text-text-muted dark:text-gray-300 font-light italic leading-relaxed">
                        "{comment.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base text-text-muted dark:text-gray-300">
                  Todavía no hay comentarios publicados para esta ruta.
                </p>
              )}
              {hasMoreComments ? (
                <div className="mt-12 flex justify-center">
                  <button
                    className="px-8 py-3 bg-white/80 dark:bg-[#203438] border-2 border-primary rounded-xl font-black text-primary uppercase tracking-[0.2em] text-xs hover:bg-primary/10 transition-all shadow-xl"
                    onClick={() =>
                      setVisibleComments((prev) =>
                        prev >= comments.length ? 4 : Math.min(prev + 4, comments.length),
                      )
                    }
                  >
                    {visibleComments >= comments.length ? 'Mostrar menos comentarios' : 'Mostrar más comentarios'}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-full max-w-xs px-6">
        <button
          className="w-full h-12 bg-primary/80 text-[#0f2a33] rounded-full font-black text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_16px_40px_-12px_rgba(19,200,236,0.35)] hover:scale-105 active:scale-95 backdrop-blur-sm group"
          onClick={() =>
            document.getElementById('proximos-encuentros')?.scrollIntoView({ behavior: 'smooth' })
          }
          type="button"
        >
          <span className="material-symbols-outlined text-2xl group-hover:rotate-180 transition-transform duration-500">
            add_circle
          </span>
          INSCRIBIRSE AHORA
        </button>
      </div>
    </main>
  )
}
