import { formatSpanishShortDate, getLocalDateTimeValue, normalizeDateInput } from '../../shared/utils/date'

// Formatea una fecha del encuentro al formato corto en español
export const formatMeetingDate = (day) => formatSpanishShortDate(day)

// Devuelve la fecha inicial formateada (no hay rangos en el modelo actual)
export const formatMeetingRange = (start, end) => {
  const safeStart = normalizeDateInput(start)
  const safeEnd = normalizeDateInput(end)
  if (!safeStart) return null
  if (!safeEnd || safeEnd === safeStart) return formatMeetingDate(safeStart)
  return `${formatMeetingDate(safeStart)} - ${formatMeetingDate(safeEnd)}`
}

// Recorta hora a HH:mm para mostrarla en UI
export const formatMeetingHour = (hour) => {
  if (!hour) return 'Hora pendiente'
  const parts = hour.split(':')
  if (parts.length < 2) return hour
  return `${parts[0].padStart(2, '0')}:${parts[1]}`
}

// Obtiene la fecha del encuentro para ordenar por recientes
export const getMeetingDateValue = (meeting) => {
  const rawDay = meeting?.day || meeting?.appDateIni || meeting?.appDateEnd
  if (!rawDay) return 0
  return getLocalDateTimeValue(rawDay, meeting?.hour)
}

// Obtiene la puntuacion del encuentro para ordenar por mejores valorados
const toFiniteNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const isPublishedStatus = (status) => String(status ?? '').toLowerCase() === 'y'

const getPreferredCommentScore = (meeting) => {
  const comments = Array.isArray(meeting?.comments) ? meeting.comments : []

  const publishedScore = comments
    .filter((comment) => isPublishedStatus(comment?.status))
    .map((comment) => toFiniteNumber(comment?.score))
    .find((score) => score !== null)

  if (publishedScore !== undefined) return publishedScore

  return comments
    .map((comment) => toFiniteNumber(comment?.score))
    .find((score) => score !== null)
}

export const getMeetingRatingValue = (meeting) => {
  const commentScore = getPreferredCommentScore(meeting)
  const averageScore = toFiniteNumber(meeting?.score?.average)
  const totalScore = toFiniteNumber(meeting?.score?.total)
  return commentScore ?? averageScore ?? totalScore ?? 0
}

// Indica si el encuentro tiene al menos un comentario con valoración
export const hasMeetingRating = (meeting) => getMeetingRatingValue(meeting) > 0

// Ordena los encuentros por fecha o por puntuacion
export const sortMeetings = (meetings, sortKey) => {
  const items = [...meetings]
  if (sortKey === 'best') {
    items.sort((a, b) => {
      // Prioriza: encuentros con valoración, luego nota descendente y finalmente fecha más reciente
      const hasRatingA = hasMeetingRating(a)
      const hasRatingB = hasMeetingRating(b)
      if (hasRatingA !== hasRatingB) return hasRatingB ? 1 : -1
      const ratingDiff = getMeetingRatingValue(b) - getMeetingRatingValue(a)
      if (ratingDiff !== 0) return ratingDiff
      return getMeetingDateValue(b) - getMeetingDateValue(a)
    })
    return items
  }
  items.sort((a, b) => getMeetingDateValue(b) - getMeetingDateValue(a))
  return items
}
