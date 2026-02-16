import { getLocalDateTimeValue } from '../../../utils/date'

// Convierte un valor de fecha en timestamp seguro, devolviendo 0 si es inválido
const toTimestamp = (value) => {
  if (!value) return 0
  const date = new Date(value)
  const time = date.getTime()
  return Number.isFinite(time) ? time : 0
}

// Obtiene la marca temporal más fiable para ordenar comentarios por recencia
const getCommentTimestamp = (comment, meeting) => {
  const fromComment =
    toTimestamp(comment?.commentDate) ||
    toTimestamp(comment?.comment_date) ||
    toTimestamp(comment?.validated_at) ||
    toTimestamp(comment?.published_at) ||
    toTimestamp(comment?.created_at) ||
    toTimestamp(comment?.updated_at) ||
    toTimestamp(comment?.createdAt) ||
    toTimestamp(comment?.updatedAt)
  if (fromComment) return fromComment
  return getLocalDateTimeValue(meeting?.day, meeting?.hour)
}

// Verifica si el comentario está aprobado/publicado según el flag de estado
export const isPublishedStatus = (status) => String(status ?? '').toLowerCase() === 'y'

// Extrae comentarios publicados y garantiza orden reciente -> antiguo
export const getPublishedComments = (meetings = []) =>
  meetings
    .flatMap((meeting) =>
      (meeting.comments ?? [])
        .filter((comment) => isPublishedStatus(comment?.status))
        .map((comment) => ({
          ...comment,
          meetingDay: meeting.day,
          meetingHour: meeting.hour,
          _sortTs: getCommentTimestamp(comment, meeting),
        })),
    )
    .sort((a, b) => b._sortTs - a._sortTs)
