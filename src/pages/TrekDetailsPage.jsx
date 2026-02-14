import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon } from 'leaflet'
import { useAuth } from '../auth/useAuth'
import { buildApiUrl } from '../utils/api'
import { getBrowserNow } from '../utils/trekDetailsViewUtils'
import { resolveImageUrl } from '../utils/urls'
import MeetingsSection from '../components/trek-details/MeetingsSection'
import PlacesSection from '../components/trek-details/PlacesSection'
import CommentsSection from '../components/trek-details/CommentsSection'
import { useTrekDetailsData } from '../hooks/useTrekDetailsData'
import { useCarouselDrag } from '../hooks/useCarouselDrag'
import {
  buildMapMarkers,
  getAttendeeCount,
  getAttendeeId,
  getPublishedComments,
  getTotalAttendees,
  getMapCenter,
  isCurrentUserGuide,
  sortMeetingsByDateDesc,
} from '../utils/trekDetailsPageUtils'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

export default function TrekDetailsPage() {
  const { regNumber } = useParams()
  const navigate = useNavigate()
  const { token, isAuthenticated, user } = useAuth()
  const { trek, isLoading, error, fetchTrek } = useTrekDetailsData(regNumber)
  const [subscribeError, setSubscribeError] = useState('')
  const [activeMeetingId, setActiveMeetingId] = useState(null)
  const [visibleComments, setVisibleComments] = useState(4)
  const carouselRef = useRef(null)
  const mapRef = useRef(null)
  const markerRefs = useRef({})
  const {
    scrollCarouselBy,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useCarouselDrag(carouselRef)

  const meetings = trek?.meetings ?? []
  const places = trek?.interesting_places ?? []
  const mapMarkers = buildMapMarkers(places)
  const mapCenter = getMapCenter(mapMarkers)
  const sortedMeetings = sortMeetingsByDateDesc(meetings)
  const comments = getPublishedComments(meetings)
  const hasMoreComments = comments.length > 4
  const shownComments = comments.slice(0, visibleComments)

  if (isLoading) {
    return (
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-10">
        <div className="bg-white rounded-xl border border-[#dbe4e6] p-8 text-center">
          <p className="text-sm text-text-muted">Cargando detalles del trek...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-10">
        <div className="bg-rose-50 rounded-xl border border-rose-200 p-8 text-center">
          <p className="text-sm text-rose-700">{error || 'No se encontró el trek solicitado.'}</p>
        </div>
      </main>
    )
  }

  if (!trek) {
    return (
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-10">
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-8 text-center">
          <p className="text-sm text-amber-800">
            No se encontró el trek solicitado.
          </p>
        </div>
      </main>
    )
  }

  const averageScore = Number(trek?.score?.average)
  const scoreCount = Number(trek?.score?.count) || 0
  const averageScoreLabel = Number.isFinite(averageScore) ? averageScore.toFixed(2) : '0.00'
  const municipalityName = trek?.municipality?.name ?? 'Municipio pendiente'
  const islandName = trek?.municipality?.island?.name ?? 'Isla pendiente'
  const zoneName = trek?.municipality?.zone?.name ?? 'zona no especificada'
  const trekName = trek?.name ?? 'Ruta sin nombre'
  const trekDescription = trek?.description ?? 'Descripción no disponible.'
  const imageSrc = resolveImageUrl(trek?.imageUrl)
  const locationLabel = `${municipalityName}, ${islandName}`

  const aboutParagraphs = [
    trekDescription,
    `La ruta transcurre por ${municipalityName}, ${zoneName}, en la isla de ${islandName}.`,
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

  const currentUserId = user?.id ?? user?.user_id
  const totalAttendees = getTotalAttendees(meetings)
  const isMeetingGuide = (meeting) => isCurrentUserGuide(meeting, currentUserId)

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
      const response = await fetch(buildApiUrl(`/api/meetings/${meetingId}/subscribe`), {
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
              {trekName}
            </h1>
            <p className="text-white/80 text-lg md:text-2xl max-w-2xl font-light leading-relaxed italic border-l-4 border-primary pl-5">
              {trekDescription}
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
            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">Resumen de la Ruta</h2>
            <div className="prose prose-lg max-w-none text-text-muted leading-relaxed space-y-6">
              <p className="text-lg md:text-xl font-light text-text-main first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                {aboutParagraphs[0]}
              </p>
              <p className="text-base md:text-lg">{aboutParagraphs[1]}</p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-background-light p-8 rounded-[1.75rem] editorial-shadow border border-[#f0f4f4]">
              <div className="grid grid-cols-2 gap-y-8">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">
                    Puntuación media
                  </span>
                  <span className="text-2xl md:text-3xl font-black tracking-tighter">
                    {averageScoreLabel}/5
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">
                    Valoraciones
                  </span>
                  <span className="text-2xl md:text-3xl font-black tracking-tighter">
                    {scoreCount}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">
                    Encuentros
                  </span>
                  <span className="text-2xl md:text-3xl font-black tracking-tighter">
                    {meetings.length}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">
                    Participantes
                  </span>
                  <span className="text-2xl md:text-3xl font-black tracking-tighter">
                    {totalAttendees}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        <MeetingsSection
          sortedMeetings={sortedMeetings}
          subscribeError={subscribeError}
          scrollCarouselBy={scrollCarouselBy}
          carouselRef={carouselRef}
          handlePointerDown={handlePointerDown}
          handlePointerMove={handlePointerMove}
          handlePointerUp={handlePointerUp}
          now={now}
          currentUserId={currentUserId}
          getAttendeeId={getAttendeeId}
          getAttendeeCount={getAttendeeCount}
          isCurrentUserGuide={isMeetingGuide}
          activeMeetingId={activeMeetingId}
          handleToggleSubscription={handleToggleSubscription}
        />

        <PlacesSection
          mapCenter={mapCenter}
          mapMarkers={mapMarkers}
          mapRef={mapRef}
          handleMapReady={handleMapReady}
          defaultIcon={defaultIcon}
          markerRefs={markerRefs}
          focusPlaceOnMap={focusPlaceOnMap}
        />

        <CommentsSection
          comments={comments}
          shownComments={shownComments}
          hasMoreComments={hasMoreComments}
          visibleComments={visibleComments}
          setVisibleComments={setVisibleComments}
        />
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
