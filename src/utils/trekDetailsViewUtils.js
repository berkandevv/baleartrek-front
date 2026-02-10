// Obtiene la fecha y hora actual en la zona de Madrid
export const getMadridNow = () => {
  const formatter = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = formatter.formatToParts(new Date())
  const get = (type) => parts.find((part) => part.type === type)?.value ?? ''
  return new Date(
    `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`,
  )
}

// Comprueba si el encuentro esta activo segun la hora de Madrid
export const isMeetingActive = (meeting, nowMadrid = getMadridNow()) => {
  const meetingStart = new Date(`${meeting.day}T${meeting.hour}`)
  const meetingEnd = new Date(meetingStart.getTime() + 2 * 60 * 60 * 1000)
  return nowMadrid <= meetingEnd
}

// Genera partes de fecha y hora para mostrar en la tarjeta
export const formatMeetingDateParts = (meeting) => {
  const meetingDate = new Date(`${meeting.day}T${meeting.hour}`)
  const day = new Intl.DateTimeFormat('es-ES', { day: '2-digit' }).format(meetingDate)
  const monthYear = new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric' }).format(meetingDate)
  const time = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(meetingDate)
  return { day, monthYear, time }
}

const normalizeDateInput = (value) => {
  if (!value) return null
  if (typeof value === 'string') {
    return value.split(' ')[0]
  }
  return value
}

export const formatApplicationDate = (value) => {
  const safeDay = normalizeDateInput(value)
  if (!safeDay) return 'Fecha pendiente'
  const date = new Date(`${safeDay}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  const formatted = date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  return formatted.replace('.', '')
}

export const isApplicationOpenToday = (meeting, nowMadrid = getMadridNow()) => {
  const start = normalizeDateInput(meeting?.appDateIni) ?? normalizeDateInput(meeting?.day)
  const end = normalizeDateInput(meeting?.appDateEnd) ?? start
  if (!start) return false
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(nowMadrid)
  const todayDate = new Date(`${today}T00:00:00`)
  const startDate = new Date(`${start}T00:00:00`)
  const endDate = new Date(`${end}T00:00:00`)
  if ([todayDate, startDate, endDate].some((date) => Number.isNaN(date.getTime()))) return false
  return todayDate >= startDate && todayDate <= endDate
}

// Forma el nombre completo con nombre y apellidos
export const formatFullName = (person) => `${person.name} ${person.lastname}`.trim()
