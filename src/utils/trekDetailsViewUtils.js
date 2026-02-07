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

// Forma el nombre completo con nombre y apellidos
export const formatFullName = (person) => `${person.name} ${person.lastname}`.trim()
