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
