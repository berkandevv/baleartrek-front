import Stars from '../Stars'
import { formatDate, getFullName, sortComments } from '../../utils/trekDetailsUtils'

const STAR_COUNT = 5
const clampRating = (score) => Math.max(0, Math.min(STAR_COUNT, Math.floor(Number(score) || 0)))
const formatMeetingDate = (meetingDay) =>
  formatDate(new Date(meetingDay), { dateStyle: 'short' })

export default function TrekDetailsComments({ comments, sortKey, onSortChange }) {
  const sortedComments = sortComments(comments, sortKey)

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111718] dark:text-white">Comentarios Validados</h2>
          <p className="text-sm text-[#618389]">De participantes verificados de ediciones anteriores</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
          <span className="text-sm font-medium text-[#618389] dark:text-gray-400">Ordenar por:</span>
          <select
            className="bg-transparent border-none text-sm font-bold text-[#111718] dark:text-white focus:ring-0 cursor-pointer py-0 pl-0 pr-8"
            onChange={({ target }) => onSortChange(target.value)}
            value={sortKey}
          >
            <option value="recent">Más recientes</option>
            <option value="best">Mejor valorados</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {sortedComments.length === 0 ? (
          <div className="bg-white dark:bg-[#1a2c30] p-6 rounded-xl border border-[#dbe4e6] dark:border-[#2a3c40] text-sm text-[#618389] dark:text-gray-300">
            Aún no hay comentarios validados para este trek.
          </div>
        ) : (
          sortedComments.map((comment) => {
            const rating = clampRating(comment.score)
            const commentDate = formatMeetingDate(comment.meetingDay)
            return (
              <div
                className="bg-white dark:bg-[#1a2c30] p-6 rounded-xl border border-[#dbe4e6] dark:border-[#2a3c40] flex flex-col gap-4 shadow-sm"
                key={`comment-${comment.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#111718] dark:text-white text-sm">
                          {getFullName(comment.user)}
                        </h3>
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-200 dark:border-green-800">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          Verificado
                        </span>
                      </div>
                      <p className="text-xs text-[#618389]">Encuentro del {commentDate}</p>
                    </div>
                  </div>
                  <Stars id={`comment-${comment.id}`} rating={rating} max={STAR_COUNT} />
                </div>
                <p className="text-[#618389] dark:text-gray-300 text-sm leading-relaxed">{comment.comment}</p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
