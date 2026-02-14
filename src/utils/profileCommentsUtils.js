import { formatSpanishShortDate, getLocalDateTimeValue, normalizeDateInput } from './date'

// Numero maximo de estrellas para valorar
const STAR_COUNT = 5

// Formatea una fecha del encuentro al formato corto en español
export const formatMeetingDate = (day) => formatSpanishShortDate(day)

// Devuelve la fecha inicial formateada (no hay rangos en el modelo actual)
export const formatMeetingRange = (start) => {
  const safeStart = normalizeDateInput(start)
  if (!safeStart) return null
  return formatMeetingDate(safeStart)
}

// Recorta hora a HH:mm para mostrarla en UI
export const formatMeetingHour = (hour) => {
  if (!hour) return 'Hora pendiente'
  const parts = hour.split(':')
  if (parts.length < 2) return hour
  return `${parts[0].padStart(2, '0')}:${parts[1]}`
}

// Asegura que la valoracion quede entre 0 y el maximo
export const clampRating = (score) =>
  Math.max(0, Math.min(STAR_COUNT, Math.floor(Number(score) || 0)))

// Obtiene la fecha del encuentro para ordenar por recientes
export const getMeetingDateValue = (meeting) => {
  const rawDay = meeting?.day || meeting?.appDateIni || meeting?.appDateEnd
  if (!rawDay) return 0
  return getLocalDateTimeValue(rawDay, meeting?.hour)
}

// Obtiene la puntuacion del encuentro para ordenar por mejores valorados
export const getMeetingRatingValue = (meeting) => {
  const commentScore = meeting?.comments?.[0]?.score
  const averageScore = meeting?.score?.average
  const totalScore = meeting?.score?.total
  const value = commentScore ?? averageScore ?? totalScore ?? 0
  return Number(value) || 0
}

export const hasMeetingRating = (meeting) => (meeting?.comments ?? []).length > 0

// Ordena los encuentros por fecha o por puntuacion
export const sortMeetings = (meetings, sortKey) => {
  const items = [...meetings]
  if (sortKey === 'best') {
    items.sort((a, b) => {
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
