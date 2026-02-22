import { getAttendeeId, isCurrentUserGuide } from './attendanceUtils'
import { isApplicationOpenToday, isMeetingActive } from './trekDetailsViewUtils'

// Fallback: valida inscripción por IDs del perfil cuando el payload del encuentro aún no refleja attendees
const hasMeetingInSet = (meeting, subscribedMeetingIds) => {
  if (!(subscribedMeetingIds instanceof Set)) return false
  const meetingId = meeting?.id
  const meetingAltId = meeting?.meeting_id
  return (
    (meetingId != null && subscribedMeetingIds.has(String(meetingId))) ||
    (meetingAltId != null && subscribedMeetingIds.has(String(meetingAltId)))
  )
}

// Determina si el usuario está inscrito comprobando asistentes y descartando el rol de guía
export const isUserSubscribedToMeeting = (
  meeting,
  currentUserId,
  { subscribedMeetingIds } = {},
) => {
  if (!currentUserId || isCurrentUserGuide(meeting, currentUserId)) return false

  const isSubscribedByAttendees = (meeting?.attendees ?? []).some(
    (attendee) => String(getAttendeeId(attendee)) === String(currentUserId),
  )

  return isSubscribedByAttendees || hasMeetingInSet(meeting, subscribedMeetingIds)
}

// Calcula el estado de suscripción consumido por botones y etiquetas del encuentro
export const getMeetingSubscriptionState = (
  meeting,
  currentUserId,
  now,
  { subscribedMeetingIds } = {},
) => {
  const isGuide = isCurrentUserGuide(meeting, currentUserId)
  const isSubscribed = isUserSubscribedToMeeting(meeting, currentUserId, {
    subscribedMeetingIds,
  })
  const isClosed = !isMeetingActive(meeting, now)
  const isApplicationOpen = isApplicationOpenToday(meeting, now)

  return {
    isGuide,
    isSubscribed,
    isClosed,
    isApplicationOpen,
  }
}
