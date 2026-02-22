import { getAttendeeCount, getAttendeeId } from './attendanceUtils'
import { getMeetingSubscriptionState } from './meetingSubscriptionState'
import { formatApplicationDate, formatMeetingDateParts } from './trekDetailsViewUtils'
import { formatFullName } from '../../shared/utils/formatters'

// Elige el texto exacto del botón de acción según el estado del encuentro y del usuario
export const getMeetingActionLabel = ({
  isGuide,
  isPending,
  isClosed,
  isApplicationOpen,
  isSubscribed,
}) => {
  if (isGuide) return 'Eres el guía'
  if (isPending) return 'Procesando...'
  if (isClosed) return 'Encuentro finalizado'
  if (!isApplicationOpen) return 'Inscripción cerrada'
  if (isSubscribed) return 'Cancelar asistencia'
  return 'Inscribirse ahora'
}

const resolveAttendeeCount = ({
  meeting,
  currentUserId,
  isGuide,
  isSubscribed,
  attendeeCountResolver,
}) => {
  const baseCount = attendeeCountResolver(meeting)
  if (!currentUserId || isGuide) return baseCount

  const isUserInAttendees = (meeting?.attendees ?? []).some(
    (attendee) => String(getAttendeeId(attendee)) === String(currentUserId),
  )

  if (isSubscribed && !isUserInAttendees) return baseCount + 1
  if (!isSubscribed && isUserInAttendees) return Math.max(0, baseCount - 1)
  return baseCount
}

// Unifica en un solo objeto todos los datos que necesita la UI del encuentro
export const getMeetingViewModel = (
  meeting,
  {
    currentUserId,
    now,
    activeMeetingId,
    attendeeCountResolver = getAttendeeCount,
    subscribedMeetingIds,
  },
) => {
  const { day, monthYear, time } = formatMeetingDateParts(meeting)
  const guideLabel = formatFullName(meeting?.guide) || 'Pendiente'
  const { isGuide, isSubscribed, isClosed, isApplicationOpen } = getMeetingSubscriptionState(
    meeting,
    currentUserId,
    now,
    { subscribedMeetingIds },
  )
  const isPending = activeMeetingId === meeting?.id
  const isDisabled = isPending || isGuide || isClosed || !isApplicationOpen

  return {
    day,
    monthYear,
    time,
    guideLabel,
    openingDate: formatApplicationDate(meeting?.appDateIni),
    closingDate: formatApplicationDate(meeting?.appDateEnd),
    attendeeCount: resolveAttendeeCount({
      meeting,
      currentUserId,
      isGuide,
      isSubscribed,
      attendeeCountResolver,
    }),
    isGuide,
    isSubscribed,
    isClosed,
    isApplicationOpen,
    isPending,
    isDisabled,
    isFeatured: isApplicationOpen,
    actionLabel: getMeetingActionLabel({ isGuide, isPending, isClosed, isApplicationOpen, isSubscribed }),
  }
}
