// Normaliza un valor a Date valida o null
const toValidDate = (value) => {
  const parsed = new Date(value)
  return parsed
}

// Formatea una fecha con opciones regionales
export const formatDate = (date, options = {}) =>
  date.toLocaleDateString('es-ES', { dateStyle: 'medium', ...options })

// Formatea una hora con opciones regionales
export const formatTime = (date, options = {}) =>
  date.toLocaleTimeString('es-ES', { timeStyle: 'short', ...options })

// Construye una fecha valida a partir del dia y hora del meeting
export const parseMeetingDate = (meeting) => {
  return toValidDate(`${meeting.day}T${meeting.hour}`)
}

// Parsea fechas de la app con separador espacio
export const parseAppDate = (value) => toValidDate(value.replace(' ', 'T'))

// Ordena meetings por fecha valida ascendente
const getSortedMeetings = (meetings) =>
  meetings
    .map((meeting) => ({ meeting, date: parseMeetingDate(meeting) }))
    .sort((a, b) => a.date - b.date)

// Devuelve el ultimo meeting por fecha
export const getLastMeeting = (meetings) => {
  const parsedMeetings = getSortedMeetings(meetings)
  return parsedMeetings[parsedMeetings.length - 1].meeting
}

// Compone nombre y apellidos con fallback
export const getFullName = (person) => {
  const name = person.name
  const lastname = person.lastname
  return `${name} ${lastname}`.trim()
}

// Calcula iniciales de la persona
export const getInitials = (person) => {
  const fullName = getFullName(person)
  return fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Genera parrafos descriptivos a partir del trek
export const buildAboutParagraphs = (trek) => {
  const paragraphs = [trek.description]
  const municipality = trek.municipality.name
  const island = trek.municipality.island.name
  const zone = trek.municipality.zone.name
  const location = `${municipality}, zona ${zone}, ${island}`
  paragraphs.push(`La ruta transcurre por ${location}, con paisajes y caminos tradicionales de la zona.`)
  return paragraphs
}

// Extrae guias unicos desde meetings
export const getGuidesFromMeetings = (meetings) => {
  const map = new Map()
  meetings.forEach((meeting) => {
    if (!map.has(meeting.guide.id)) {
      map.set(meeting.guide.id, meeting.guide)
    }
  })
  const guides = []
  map.forEach((guide) => {
    guides.push(guide)
  })
  return guides
}

// Aplana y filtra comentarios validados de los meetings
export const getValidatedCommentsFromMeetings = (meetings) =>
  meetings
    .flatMap((meeting) =>
      meeting.comments.map((comment) => ({
        ...comment,
        meetingDay: meeting.day,
      })),
    )
    .filter((comment) => comment.status === 'y')

// Ordena comentarios por mejor puntuacion o por fecha reciente
export const sortComments = (comments, sortKey) => {
  const list = [...comments]
  if (sortKey === 'best') {
    return list.sort((a, b) => b.score - a.score)
  }
  return list.sort((a, b) => {
    const dateA = new Date(a.meetingDay).getTime()
    const dateB = new Date(b.meetingDay).getTime()
    return dateB - dateA
  })
}
