import { formatFullName } from '../../utils/trekDetailsViewUtils'

export default function CommentsSection({
  comments,
  shownComments,
  hasMoreComments,
  visibleComments,
  setVisibleComments,
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20">
      <div className="bg-background-light rounded-[2.5rem] p-10 md:p-14 editorial-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-primary/15">
          <span className="material-symbols-outlined text-[9rem] leading-none">forum</span>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-primary mb-6">
            <span className="h-px w-12 bg-primary" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Testimonios</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black mb-10 tracking-tighter">
            Comentarios de la Comunidad
          </h3>
          {comments.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {shownComments.map((comment) => {
                const rating = Math.max(0, Math.min(5, Math.floor(Number(comment?.score) || 0)))
                return (
                  <div className="relative pl-8 border-l-4 border-primary/20" key={comment.id}>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="block font-black text-base tracking-tight">
                          {formatFullName(comment.user)}
                        </span>
                        <span className="text-xs text-corporate-blue uppercase font-black tracking-widest">
                          Comentario verificado
                        </span>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span
                            className={`material-symbols-outlined ${
                              index < rating ? 'star-rating text-orange-400' : 'text-slate-300'
                            }`}
                            key={`${comment.id}-star-${index}`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-base text-text-muted font-light italic leading-relaxed">
                      "{comment.comment}"
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-base text-text-muted">
              Todavía no hay comentarios publicados para esta ruta.
            </p>
          )}
          {hasMoreComments ? (
            <div className="mt-12 flex justify-center">
              <button
                className="px-8 py-3 bg-white/80 border-2 border-primary rounded-xl font-black text-primary uppercase tracking-[0.2em] text-xs hover:bg-primary/10 transition-all shadow-xl"
                onClick={() =>
                  setVisibleComments((prev) =>
                    prev >= comments.length ? 4 : Math.min(prev + 4, comments.length),
                  )
                }
              >
                {visibleComments >= comments.length ? 'Mostrar menos comentarios' : 'Mostrar más comentarios'}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
