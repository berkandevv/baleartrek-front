import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TrekDetailsAbout from '../components/trek-details/TrekDetailsAbout'
import TrekDetailsComments from '../components/trek-details/TrekDetailsComments'
import TrekDetailsHero from '../components/trek-details/TrekDetailsHero'
import TrekDetailsHighlights from '../components/trek-details/TrekDetailsHighlights'
import TrekDetailsMeta from '../components/trek-details/TrekDetailsMeta'
import TrekDetailsSidebar from '../components/trek-details/TrekDetailsSidebar'
import {
  buildAboutParagraphs,
  formatDate,
  formatTime,
  getGuidesFromMeetings,
  getLastMeeting,
  getValidatedCommentsFromMeetings,
  parseAppDate,
  parseMeetingDate,
} from '../utils/trekDetailsUtils'

const buildTrekEndpoint = (regNumber) =>
  `http://localhost:8000/api/treks/${encodeURIComponent(regNumber)}`

export default function TrekDetailsPage() {
  const { regNumber } = useParams()
  const navigate = useNavigate()
  const [trek, setTrek] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sortKey, setSortKey] = useState('recent')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTrek = async () => {
      setIsLoading(true)
      try {
        setError('')
        const response = await fetch(buildTrekEndpoint(regNumber))
        const payload = await response.json()
        setTrek(payload.data)
      } catch (error) {
        console.error('Error al cargar el trek:', error)
        setError('No se pudo cargar este trek. Intenta de nuevo más tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrek()
  }, [regNumber])

  if (isLoading) {
    return (
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-10">
        <div className="bg-white dark:bg-[#1a2c30] rounded-xl border border-[#dbe4e6] dark:border-[#2a3c40] p-8 text-center">
          <p className="text-sm text-text-muted">Cargando detalles del trek...</p>
        </div>
      </main>
    )
  }

  if (error || !trek) {
    return (
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-10">
        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-900/40 p-8 text-center">
          <p className="text-sm text-rose-700 dark:text-rose-200">{error || 'No se encontró el trek solicitado.'}</p>
        </div>
      </main>
    )
  }

  const meetings = trek.meetings
  const lastMeeting = getLastMeeting(meetings)

  const meetingDate = parseMeetingDate(lastMeeting)
  const dateLabel = formatDate(meetingDate)
  const timeLabel = formatTime(meetingDate)

  const appDateIni = parseAppDate(lastMeeting.appDateIni)
  const appDateEnd = parseAppDate(lastMeeting.appDateEnd)

  const totalAttendees = lastMeeting.attendees.length

  const guides = getGuidesFromMeetings([lastMeeting])
  const comments = getValidatedCommentsFromMeetings(meetings)
  const aboutParagraphs = buildAboutParagraphs(trek)

  const isOpen = trek.status === 'y'
  const statusLabel = isOpen ? 'Inscripción Abierta' : 'Inscripción Cerrada'

  return (
    <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <TrekDetailsHero trek={trek} />
          <TrekDetailsMeta dateLabel={dateLabel} timeLabel={timeLabel} />
          <TrekDetailsAbout aboutParagraphs={aboutParagraphs} trekId={trek.id} />
          <TrekDetailsHighlights places={trek.interesting_places} />
          <TrekDetailsComments comments={comments} sortKey={sortKey} onSortChange={setSortKey} />
        </div>

        <div className="lg:col-span-4 relative">
          <TrekDetailsSidebar
            appDateEnd={appDateEnd}
            appDateIni={appDateIni}
            dateLabel={dateLabel}
            guides={guides}
            isOpen={isOpen}
            onSignup={() => navigate('/login')}
            statusLabel={statusLabel}
            timeLabel={timeLabel}
            totalAttendees={totalAttendees}
          />
        </div>
      </div>
    </main>
  )
}
