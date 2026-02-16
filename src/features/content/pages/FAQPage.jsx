import { Link } from 'react-router-dom'
import Stars from '../../../components/Stars'

const renderRatingStars = (rating) => (
  <Stars
    id={`faq-stars-${rating}`}
    rating={rating}
    max={5}
    className="text-xl leading-none"
    filledClassName="text-orange-400"
    emptyClassName="text-slate-300"
  />
)

export default function FAQPage() {
  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40 py-16">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black text-[#101f22] mb-4 tracking-tight">
          Preguntas Frecuentes
        </h2>
        <p className="text-lg text-[#618389]">
          Consulta toda la información relevante de forma directa y clara para disfrutar de tu próxima aventura.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-white via-[#f7fcfd] to-[#eef8fb] p-8 md:p-12 rounded-3xl shadow-sm border border-[#e3f3f6]">
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-[#d9edf2]">
            <span className="material-symbols-outlined text-primary text-3xl">quiz</span>
            <h3 className="text-2xl font-bold">Información General</h3>
          </div>

          <div className="space-y-6">
            <details className="group border border-[#d8edf2] bg-white/80 rounded-2xl px-5 md:px-6 py-4 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_28px_-20px_rgba(34,193,231,0.9)]" open>
              <summary className="flex items-center justify-between cursor-pointer py-2 list-none">
                <span className="text-xl font-bold text-[#101f22] flex items-center gap-2 pr-4">
                  <span className="material-symbols-outlined text-primary">app_registration</span>
                  Reglas de Inscripción
                </span>
                <span className="material-symbols-outlined text-primary transition-transform duration-300 text-3xl group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="size-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[28px]">event_available</span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#101f22]">Apertura de Inscripciones</p>
                    <p className="text-sm text-[#618389] mt-1">
                      Se abren <span className="text-green-600 font-bold uppercase tracking-wide">1 mes antes</span> de la fecha de la excursión programada.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="size-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[28px]">event_busy</span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#101f22]">Cierre de Inscripciones</p>
                    <p className="text-sm text-[#618389] mt-1">
                      Se cierran definitivamente <span className="text-red-600 font-bold uppercase tracking-wide">1 semana antes</span> del evento por motivos de organización.
                    </p>
                  </div>
                </div>
              </div>
            </details>

            <details className="group border border-[#d8edf2] bg-white/80 rounded-2xl px-5 md:px-6 py-4 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_28px_-20px_rgba(34,193,231,0.9)]">
              <summary className="flex items-center justify-between cursor-pointer py-2 list-none">
                <span className="text-xl font-bold text-[#101f22] flex items-center gap-2 pr-4">
                  <span className="material-symbols-outlined text-primary">grade</span>
                  Escala de Valoración
                </span>
                <span className="material-symbols-outlined text-primary transition-transform duration-300 text-3xl group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="mt-4 bg-[#f6fbfd] p-6 rounded-2xl border border-[#dbeef3]">
                <p className="text-sm text-[#618389] mb-6 leading-relaxed">
                  Tras completar una excursión, los participantes pueden valorar su experiencia para reflejar su satisfacción general.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#dbeef3]">
                    {renderRatingStars(0)}
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nivel 0</p>
                      <p className="text-sm font-semibold text-[#101f22]">Sin valoración</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#dbeef3]">
                    {renderRatingStars(1)}
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">1 Estrella</p>
                      <p className="text-sm font-semibold text-[#101f22]">Experiencia deficiente</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#dbeef3]">
                    {renderRatingStars(2)}
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">2 Estrellas</p>
                      <p className="text-sm font-semibold text-[#101f22]">Experiencia mejorable</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#dbeef3]">
                    {renderRatingStars(3)}
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">3 Estrellas</p>
                      <p className="text-sm font-semibold text-[#101f22]">Buena experiencia</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#dbeef3]">
                    {renderRatingStars(4)}
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">4 Estrellas</p>
                      <p className="text-sm font-semibold text-[#101f22]">Experiencia excelente</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    {renderRatingStars(5)}
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">5 Estrellas</p>
                      <p className="text-sm font-black text-[#101f22]">Experiencia excepcional</p>
                    </div>
                  </div>
                </div>
              </div>
            </details>

            <details className="group border border-[#d8edf2] bg-white/80 rounded-2xl px-5 md:px-6 py-4 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_28px_-20px_rgba(34,193,231,0.9)]">
              <summary className="flex items-center justify-between cursor-pointer py-2 list-none">
                <span className="text-xl font-bold text-[#101f22] flex items-center gap-2 pr-4">
                  <span className="material-symbols-outlined text-primary">forum</span>
                  Normas de Comentarios
                </span>
                <span className="material-symbols-outlined text-primary transition-transform duration-300 text-3xl group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="mt-4 bg-[#f6fbfd] p-6 rounded-2xl border border-[#dbeef3]">
                <p className="text-base text-[#618389] leading-relaxed mb-5">
                  En BalearTrek valoramos la opinión de la comunidad. El contenido generado por usuarios debe seguir estas directrices:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-[#618389]">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    <span>
                      <strong className="text-[#101f22]">Respeto y civismo:</strong> los comentarios deben ser constructivos y respetuosos con otros miembros y guías.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#618389]">
                    <span className="material-symbols-outlined text-green-500 text-lg">add_a_photo</span>
                    <span>
                      <strong className="text-[#101f22]">Contenido multimedia:</strong> se permite subir solo <strong className="text-[#101f22]">1 foto por encuentro</strong>, y debe ser una imagen real de la experiencia en ruta.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#618389]">
                    <span className="material-symbols-outlined text-amber-500 text-lg">pending_actions</span>
                    <span>
                      <strong className="text-[#101f22]">Moderación:</strong> los comentarios no se publicarán ni serán visibles hasta que el administrador los apruebe (estado <span className="italic font-semibold">Pendiente</span>).
                    </span>
                  </li>
                </ul>
              </div>
            </details>

            <details className="group border border-[#d8edf2] bg-white/80 rounded-2xl px-5 md:px-6 py-4 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_28px_-20px_rgba(34,193,231,0.9)]">
              <summary className="flex items-center justify-between cursor-pointer py-2 list-none">
                <span className="text-xl font-bold text-[#101f22] flex items-center gap-2 pr-4">
                  <span className="material-symbols-outlined text-primary">health_and_safety</span>
                  Seguro de Accidentes
                </span>
                <span className="material-symbols-outlined text-primary transition-transform duration-300 text-3xl group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="mt-4 bg-[#f6fbfd] p-6 rounded-2xl border border-[#dbeef3]">
                <p className="text-base text-[#618389] leading-relaxed">
                  BalearTrek no cobra cuotas de inscripción, por lo que{' '}
                  <span className="font-semibold text-[#101f22]">no se incluye ningún seguro de accidentes en el precio</span>. Recomendamos participar con licencia federativa en vigor o con un seguro personal que cubra asistencia sanitaria y rescate en montaña.
                </p>
              </div>
            </details>

            <details className="group border border-[#d8edf2] bg-white/80 rounded-2xl px-5 md:px-6 py-4 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_28px_-20px_rgba(34,193,231,0.9)]">
              <summary className="flex items-center justify-between cursor-pointer py-2 list-none">
                <span className="text-xl font-bold text-[#101f22] flex items-center gap-2 pr-4">
                  <span className="material-symbols-outlined text-primary">cancel</span>
                  Política de Cancelación
                </span>
                <span className="material-symbols-outlined text-primary transition-transform duration-300 text-3xl group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="mt-4 bg-[#f6fbfd] p-6 rounded-2xl border border-[#dbeef3]">
                <p className="text-base text-[#618389] leading-relaxed">
                  Entendemos que los planes pueden cambiar. Puedes cancelar tu plaza en cualquier momento, ya que nuestras excursiones son{' '}
                  <span className="font-semibold text-[#101f22]">gratuitas</span> y no se realiza ningún cobro.
                </p>
                <p className="text-base text-[#618389] mt-4 leading-relaxed">
                  Si no puedes asistir, te agradecemos avisar con antelación para liberar tu plaza y facilitar la organización del grupo.
                </p>
              </div>
            </details>

            <details className="group border border-[#d8edf2] bg-white/80 rounded-2xl px-5 md:px-6 py-4 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_28px_-20px_rgba(34,193,231,0.9)]">
              <summary className="flex items-center justify-between cursor-pointer py-2 list-none">
                <span className="text-xl font-bold text-[#101f22] flex items-center gap-2 pr-4">
                  <span className="material-symbols-outlined text-primary">fitness_center</span>
                  Requisitos Físicos
                </span>
                <span className="material-symbols-outlined text-primary transition-transform duration-300 text-3xl group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="mt-4 bg-[#f6fbfd] p-6 rounded-2xl border border-[#dbeef3]">
                <p className="text-base text-[#618389] leading-relaxed mb-4">
                  Nuestras excursiones transcurren por terrenos naturales que requieren una condición física adecuada. Recomendamos a los participantes:
                </p>
                <ul className="space-y-3 text-sm text-[#618389]">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Tener experiencia previa caminando por senderos de montaña.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    No padecer lesiones o afecciones que impidan la actividad física prolongada.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Estar habituado a desniveles positivos y terrenos irregulares.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    Consultar siempre la descripción técnica de cada excursión antes de inscribirse.
                  </li>
                </ul>
              </div>
            </details>
          </div>

          <div className="mt-16 p-8 bg-primary/5 rounded-3xl border border-primary/20 flex flex-col md:flex-row items-center gap-6 text-center">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-4xl">support_agent</span>
            </div>
            <div>
              <p className="text-lg font-bold text-[#101f22] uppercase tracking-wider mb-1">¿Aún tienes dudas?</p>
              <p className="text-base text-[#618389]">
                Si necesitas información adicional, nuestro equipo está listo para ayudarte.
              </p>
            </div>
            <Link className="mx-auto px-8 py-4 bg-primary text-[#101f22] font-bold rounded-2xl hover:bg-primary/90 transition-all text-base shadow-lg shadow-primary/10" to="/contacto">
              Contactar Ahora
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
