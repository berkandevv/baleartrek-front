import { Link } from 'react-router-dom'
import { getMeetingViewModel } from '../utils/meetingViewModel'

export default function MeetingsSection({
  sortedMeetings,
  subscribeError,
  scrollCarouselBy,
  carouselRef,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  now,
  currentUserId,
  activeMeetingId,
  handleToggleSubscription,
  regNumber,
}) {
  return (
    <section
      className="w-full bg-[#f9fafb] py-12 overflow-hidden"
      id="proximos-encuentros"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-primary mb-4">
              <span className="h-px w-12 bg-primary" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Agenda de la Comunidad</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black leading-tight">Próximos Encuentros</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-primary">{sortedMeetings.length}</span>
              <span className="text-[10px] font-bold text-text-muted uppercase leading-tight">
                Fechas
                <br />
                Registradas
              </span>
            </div>
            <div className="hidden md:flex gap-3">
              <button
                className="size-11 rounded-full border-2 border-primary text-primary flex items-center justify-center hover:bg-primary/10 transition-all shadow-lg active:scale-90"
                onClick={() => scrollCarouselBy(-360)}
                type="button"
                aria-label="Desplazar encuentros a la izquierda"
              >
                <span className="material-symbols-outlined font-bold">arrow_back</span>
              </button>
              <button
                className="size-11 rounded-full bg-primary text-[#0f2a33] flex items-center justify-center hover:bg-[#0fb6d8] transition-all shadow-lg active:scale-90"
                onClick={() => scrollCarouselBy(360)}
                type="button"
                aria-label="Desplazar encuentros a la derecha"
              >
                <span className="material-symbols-outlined font-bold">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
        {subscribeError ? (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {subscribeError}
          </div>
        ) : null}
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20">
        <div className="relative group overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f9fafb]/90 to-transparent" />
          <div
            className="no-scrollbar flex overflow-x-auto gap-5 py-6 snap-x snap-mandatory cursor-grab active:cursor-grabbing"
            ref={carouselRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {sortedMeetings.map((meeting) => {
              const viewModel = getMeetingViewModel(meeting, {
                currentUserId,
                now,
                activeMeetingId,
              })

              return (
                <div
                  className={`flex-none ${viewModel.isFeatured ? 'w-80' : 'w-72'} snap-center`}
                  key={meeting.id}
                >
                  <div
                    className={`bg-white ${
                      viewModel.isFeatured
                        ? 'p-7 rounded-[2rem] border-4 border-corporate-blue'
                        : 'p-6 rounded-[1.5rem] border border-gray-100'
                    } editorial-shadow h-full`}
                  >
                    <div className={`${viewModel.isFeatured ? 'text-corporate-blue' : 'text-primary'} mb-6 flex justify-between items-start`}>
                      <div>
                        <span className={`${viewModel.isFeatured ? 'text-4xl' : 'text-3xl'} font-black leading-none`}>{viewModel.day}</span>
                        <span className={`block text-xs font-bold uppercase tracking-widest ${viewModel.isFeatured ? 'mt-2' : 'mt-1'}`}>
                          {viewModel.monthYear}
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-primary/10 text-corporate-blue text-[10px] font-black rounded-full uppercase">
                        {viewModel.attendeeCount} participantes
                      </span>
                    </div>
                    <div className={`${viewModel.isFeatured ? 'space-y-4 mb-8' : 'space-y-3 mb-6'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined ${viewModel.isFeatured ? 'text-xl text-corporate-blue' : 'text-base text-text-muted'}`}>
                          schedule
                        </span>
                        <span className={`${viewModel.isFeatured ? 'text-base font-black tracking-tight' : 'text-xs font-bold'}`}>
                          {viewModel.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined ${viewModel.isFeatured ? 'text-xl text-corporate-blue' : 'text-base text-text-muted'}`}>
                          person_pin
                        </span>
                        <span className="text-xs text-text-muted">
                          Guía: <span className="font-black text-text-main uppercase">{viewModel.guideLabel}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 py-4 border-y-2 border-corporate-blue/10">
                      <div className="flex items-center gap-3 text-xs font-bold text-corporate-blue/80 uppercase">
                        <span className="material-symbols-outlined text-lg text-green-500">calendar_today</span>
                        Apertura: {viewModel.openingDate}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-corporate-blue/80 uppercase">
                        <span className="material-symbols-outlined text-lg text-red-500">event_busy</span>
                        Cierre: {viewModel.closingDate}
                      </div>
                    </div>
                    <button
                      className={`w-full mt-4 ${
                        viewModel.isClosed
                          ? 'py-3 bg-slate-200 text-slate-700 font-black rounded-xl text-xs'
                          : viewModel.isSubscribed
                            ? 'py-3 bg-rose-600 text-white font-black rounded-xl text-xs hover:bg-rose-700'
                            : viewModel.isFeatured
                              ? 'py-4 bg-primary text-[#0f2a33] font-black rounded-xl text-sm hover:bg-[#0fb6d8]'
                              : 'py-3 bg-white/80 border-2 border-primary text-primary font-black rounded-xl text-xs hover:bg-primary/10'
                      } transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
                      type="button"
                      onClick={() =>
                        handleToggleSubscription(meeting.id, viewModel.isSubscribed, viewModel.isGuide)
                      }
                      disabled={viewModel.isDisabled}
                    >
                      {viewModel.actionLabel.toUpperCase()}
                    </button>
                    <Link
                      className={`mt-3 inline-flex w-full items-center justify-center rounded-xl py-3 text-xs font-black transition-all ${
                        viewModel.isClosed
                          ? 'border-2 border-corporate-blue bg-corporate-blue text-white hover:bg-blue-700'
                          : 'border-2 border-primary text-primary hover:bg-primary/10'
                      }`}
                      to={`/treks/${encodeURIComponent(regNumber)}/encuentros/${meeting.id}`}
                    >
                      DETALLES
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
