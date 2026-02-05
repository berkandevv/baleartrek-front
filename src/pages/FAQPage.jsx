import { Link } from 'react-router-dom'

export default function FAQPage() {
  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40 py-16">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black text-[#101f22] dark:text-white mb-4 tracking-tight">
          Preguntas Frecuentes
        </h2>
        <p className="text-lg text-[#618389] dark:text-gray-400">
          Consulta toda la información relevante de forma directa y clara para disfrutar de tu próxima aventura.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#1a2c30] p-8 md:p-12 rounded-3xl shadow-sm border border-[#f0f4f4] dark:border-[#2a3c40]">
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100 dark:border-[#2a3c40]">
            <span className="material-symbols-outlined text-primary text-3xl">quiz</span>
            <h3 className="text-2xl font-bold dark:text-white">Información General</h3>
          </div>

          <div className="space-y-6">
            <details className="group border-b border-gray-100 dark:border-[#2a3c40] pb-6" open>
              <summary className="flex items-center justify-between cursor-pointer py-2 list-none">
                <span className="text-xl font-bold text-[#101f22] dark:text-white flex items-center gap-2 pr-4">
                  <span className="material-symbols-outlined text-primary">app_registration</span>
                  Reglas de Inscripción
                </span>
                <span className="material-symbols-outlined text-primary transition-transform duration-300 text-3xl group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-[#203438] rounded-2xl border border-gray-100 dark:border-white/5">
                  <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[28px]">event_available</span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#101f22] dark:text-white">Apertura de Inscripciones</p>
                    <p className="text-sm text-[#618389] dark:text-gray-400 mt-1">
                      Se abren <span className="text-green-600 dark:text-green-400 font-bold uppercase tracking-wide">1 mes antes</span> de la fecha de la excursión programada.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-[#203438] rounded-2xl border border-gray-100 dark:border-white/5">
                  <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[28px]">event_busy</span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#101f22] dark:text-white">Cierre de Inscripciones</p>
                    <p className="text-sm text-[#618389] dark:text-gray-400 mt-1">
                      Se cierran definitivamente <span className="text-red-600 dark:text-red-400 font-bold uppercase tracking-wide">1 semana antes</span> del evento por motivos de organización.
                    </p>
                  </div>
                </div>
              </div>
            </details>

            <details className="group border-b border-gray-100 dark:border-[#2a3c40] pb-6">
              <summary className="flex items-center justify-between cursor-pointer py-2 list-none">
                <span className="text-xl font-bold text-[#101f22] dark:text-white flex items-center gap-2 pr-4">
                  <span className="material-symbols-outlined text-primary">health_and_safety</span>
                  Seguro de Accidentes
                </span>
                <span className="material-symbols-outlined text-primary transition-transform duration-300 text-3xl group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="mt-4 bg-gray-50 dark:bg-[#203438] p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                <p className="text-base text-[#618389] dark:text-gray-400 leading-relaxed">
                  BalearTrek no cobra cuotas de inscripción, por lo que{' '}
                  <span className="font-semibold text-[#101f22] dark:text-white">no se incluye ningún seguro de accidentes en el precio</span>. Recomendamos participar con licencia federativa en vigor o con un seguro personal que cubra asistencia sanitaria y rescate en montaña.
                </p>
              </div>
            </details>

            <details className="group border-b border-gray-100 dark:border-[#2a3c40] pb-6">
              <summary className="flex items-center justify-between cursor-pointer py-2 list-none">
                <span className="text-xl font-bold text-[#101f22] dark:text-white flex items-center gap-2 pr-4">
                  <span className="material-symbols-outlined text-primary">cancel</span>
                  Política de Cancelación
                </span>
                <span className="material-symbols-outlined text-primary transition-transform duration-300 text-3xl group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="mt-4 bg-gray-50 dark:bg-[#203438] p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                <p className="text-base text-[#618389] dark:text-gray-400 leading-relaxed">
                  Entendemos que los planes pueden cambiar. Puedes cancelar tu plaza en cualquier momento, ya que nuestras rutas son{' '}
                  <span className="font-semibold text-[#101f22] dark:text-white">gratuitas</span> y no se realiza ningún cobro.
                </p>
                <p className="text-base text-[#618389] dark:text-gray-400 mt-4 leading-relaxed">
                  Si no puedes asistir, te agradecemos avisar con antelación para liberar tu plaza y facilitar la organización del grupo.
                </p>
              </div>
            </details>

            <details className="group border-b border-gray-100 dark:border-[#2a3c40] pb-6">
              <summary className="flex items-center justify-between cursor-pointer py-2 list-none">
                <span className="text-xl font-bold text-[#101f22] dark:text-white flex items-center gap-2 pr-4">
                  <span className="material-symbols-outlined text-primary">fitness_center</span>
                  Requisitos Físicos
                </span>
                <span className="material-symbols-outlined text-primary transition-transform duration-300 text-3xl group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="mt-4 bg-gray-50 dark:bg-[#203438] p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                <p className="text-base text-[#618389] dark:text-gray-400 leading-relaxed mb-4">
                  Nuestras rutas transcurren por terrenos naturales que requieren una condición física adecuada. Recomendamos a los participantes:
                </p>
                <ul className="space-y-3 text-sm text-[#618389] dark:text-gray-400">
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
                    Consultar siempre la descripción técnica de cada ruta antes de inscribirse.
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
              <p className="text-lg font-bold text-[#101f22] dark:text-white uppercase tracking-wider mb-1">¿Aún tienes dudas?</p>
              <p className="text-base text-[#618389] dark:text-gray-300">
                Si necesitas información adicional sobre un evento específico, nuestro equipo está listo para ayudarte.
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
