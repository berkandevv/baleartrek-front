import { getAttendeeId, isCurrentUserGuide } from './attendanceUtils'
import { isApplicationOpenToday, isMeetingActive } from './trekDetailsViewUtils'

// Determina si el usuario está inscrito comprobando asistentes y descartando el rol de guía
export const isUserSubscribedToMeeting = (meeting, currentUserId) =>
  Boolean(currentUserId) &&
  !isCurrentUserGuide(meeting, currentUserId) &&
  (meeting?.attendees ?? []).some(
    (attendee) => String(getAttendeeId(attendee)) === String(currentUserId),
  )

// Calcula el estado de suscripción consumido por botones y etiquetas del encuentro
export const getMeetingSubscriptionState = (meeting, currentUserId, now) => {
  const isGuide = isCurrentUserGuide(meeting, currentUserId)
  const isSubscribed = isUserSubscribedToMeeting(meeting, currentUserId)
  const isClosed = !isMeetingActive(meeting, now)
  const isApplicationOpen = isApplicationOpenToday(meeting, now)

  return {
    isGuide,
    isSubscribed,
    isClosed,
    isApplicationOpen,
  }
}
