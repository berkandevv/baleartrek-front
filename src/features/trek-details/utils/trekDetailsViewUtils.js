import { formatSpanishShortDate, normalizeDateInput, parseLocalDateTime } from '../../../utils/date'

// Obtiene la fecha y hora actual del navegador (zona local del usuario)
export const getBrowserNow = () => new Date()

// Combina día y hora del encuentro en una fecha local utilizable en cálculos
const getMeetingDate = (meeting) => {
  return parseLocalDateTime(meeting?.day, meeting?.hour)
}

// Comprueba si el encuentro esta activo segun la hora local del navegador
export const isMeetingActive = (meeting, now = getBrowserNow()) => {
  const meetingStart = getMeetingDate(meeting)
  if (!meetingStart) return false
  const meetingEnd = new Date(meetingStart.getTime() + 2 * 60 * 60 * 1000)
  return now <= meetingEnd
}

// Genera partes de fecha y hora para mostrar en la tarjeta
export const formatMeetingDateParts = (meeting) => {
  const meetingDate = getMeetingDate(meeting)
  if (!meetingDate) {
    return { day: '--', monthYear: 'fecha pendiente', time: 'Hora pendiente' }
  }
  const day = new Intl.DateTimeFormat('es-ES', { day: '2-digit' }).format(meetingDate)
  const monthYear = new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric' }).format(meetingDate)
  const time = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(meetingDate)
  return { day, monthYear, time }
}

// Formatea la fecha de apertura/cierre de inscripción para mostrarla en UI
export const formatApplicationDate = (value) => {
  return formatSpanishShortDate(value)
}

// Evalúa si hoy está dentro del rango permitido de inscripción del encuentro
export const isApplicationOpenToday = (meeting, now = getBrowserNow()) => {
  const start = normalizeDateInput(meeting?.appDateIni) ?? normalizeDateInput(meeting?.day)
  const end = normalizeDateInput(meeting?.appDateEnd) ?? start
  if (!start) return false
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startDate = new Date(`${start}T00:00:00`)
  const endDate = new Date(`${end}T00:00:00`)
  if ([todayDate, startDate, endDate].some((date) => Number.isNaN(date.getTime()))) return false
  return todayDate >= startDate && todayDate <= endDate
}

// Forma el nombre completo con nombre y apellidos
export const formatFullName = (person) =>
  `${person?.name ?? ''} ${person?.lastname ?? ''}`.trim()
