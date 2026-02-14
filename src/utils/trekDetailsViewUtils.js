import { formatSpanishShortDate, normalizeDateInput } from './date'

// Obtiene la fecha y hora actual del navegador (zona local del usuario)
export const getBrowserNow = () => new Date()

// Comprueba si el encuentro esta activo segun la hora local del navegador
export const isMeetingActive = (meeting, now = getBrowserNow()) => {
  const meetingStart = new Date(`${meeting.day}T${meeting.hour}`)
  const meetingEnd = new Date(meetingStart.getTime() + 2 * 60 * 60 * 1000)
  return now <= meetingEnd
}

// Genera partes de fecha y hora para mostrar en la tarjeta
export const formatMeetingDateParts = (meeting) => {
  const meetingDate = new Date(`${meeting.day}T${meeting.hour}`)
  const day = new Intl.DateTimeFormat('es-ES', { day: '2-digit' }).format(meetingDate)
  const monthYear = new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric' }).format(meetingDate)
  const time = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(meetingDate)
  return { day, monthYear, time }
}

export const formatApplicationDate = (value) => {
  return formatSpanishShortDate(value)
}

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
