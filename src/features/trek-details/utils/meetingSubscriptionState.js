import { getAttendeeId, isCurrentUserGuide } from './attendanceUtils'
import { isApplicationOpenToday, isMeetingActive } from './trekDetailsViewUtils'

export const isUserSubscribedToMeeting = (meeting, currentUserId) =>
  Boolean(currentUserId) &&
  !isCurrentUserGuide(meeting, currentUserId) &&
  (meeting?.attendees ?? []).some(
    (attendee) => String(getAttendeeId(attendee)) === String(currentUserId),
  )

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
