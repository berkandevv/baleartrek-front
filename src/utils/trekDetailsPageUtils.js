import { getLocalDateTimeValue } from './date'

// Convierte coordenadas "lat,lng" en números válidos
export const parseGpsCoordinates = (gps) => {
  if (typeof gps !== 'string' || !gps.includes(',')) return null
  const [latRaw, lngRaw] = gps.split(',').map((value) => value.trim())
  const lat = Number(latRaw)
  const lng = Number(lngRaw)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

// Enriquece lugares con lat/lng y descarta coordenadas inválidas
export const buildMapMarkers = (places = []) =>
  places
    .map((place) => {
      const coordinates = parseGpsCoordinates(place?.gps)
      if (!coordinates) return null
      return { ...place, ...coordinates }
    })
    .filter(Boolean)

// Calcula el centro promedio de los marcadores o usa fallback balear
export const getMapCenter = (mapMarkers = []) =>
  mapMarkers.length
    ? [
        mapMarkers.reduce((sum, place) => sum + place.lat, 0) / mapMarkers.length,
        mapMarkers.reduce((sum, place) => sum + place.lng, 0) / mapMarkers.length,
      ]
    : [39.6, 2.9]

// Ordena encuentros de más reciente a más antiguo
export const sortMeetingsByDateDesc = (meetings = []) =>
  [...meetings].sort((a, b) =>
    getLocalDateTimeValue(b?.day, b?.hour) - getLocalDateTimeValue(a?.day, a?.hour),
  )

// Extrae solo comentarios publicados y añade el día del encuentro
export const getPublishedComments = (meetings = []) =>
  meetings.flatMap((meeting) =>
    (meeting.comments ?? [])
      .filter((comment) => String(comment?.status ?? '').toLowerCase() === 'y')
      .map((comment) => ({
        ...comment,
        meetingDay: meeting.day,
      })),
  )

// Obtiene id de asistente con compatibilidad entre formatos de API
export const getAttendeeId = (attendee) => attendee?.id ?? attendee?.user_id ?? attendee?.pivot?.user_id

// Obtiene id del guía con compatibilidad entre formatos de API
export const getGuideId = (meeting) => meeting?.guide?.id ?? meeting?.guide?.user_id

// Comprueba si el usuario actual coincide con el guía del encuentro
export const isCurrentUserGuide = (meeting, currentUserId) =>
  Boolean(currentUserId) && String(getGuideId(meeting)) === String(currentUserId)

// Cuenta asistentes excluyendo al guía cuando esté presente
export const getAttendeeCount = (meeting) => {
  const guideId = getGuideId(meeting)
  const attendees = meeting?.attendees ?? []
  if (!guideId) return attendees.length
  return attendees.filter((attendee) => String(getAttendeeId(attendee)) !== String(guideId)).length
}

// Suma asistentes de todos los encuentros para métricas de cabecera
export const getTotalAttendees = (meetings = []) =>
  meetings.reduce((total, meeting) => total + getAttendeeCount(meeting), 0)
