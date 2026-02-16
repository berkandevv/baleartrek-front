import { getLocalDateTimeValue } from '../../../utils/date'

// Ordena encuentros de más reciente a más antiguo
export const sortMeetingsByDateDesc = (meetings = []) =>
  [...meetings].sort((a, b) =>
    getLocalDateTimeValue(b?.day, b?.hour) - getLocalDateTimeValue(a?.day, a?.hour),
  )
