const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'berkanraimov@gmail.com'

// Muestra el formulario de contacto y prepara un correo con los datos introducidos
export default function ContactPage() {
  // Construye un enlace `mailto:` con asunto y cuerpo preformateado desde el formulario
  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const message = String(formData.get('message') || '').trim()

    const subject = `Consulta web - ${name || 'Sin nombre'}`
    const body = [
      'Hola BalearTrek,',
      '',
      'Te contacto desde el formulario web con los siguientes datos:',
      `Nombre: ${name}`,
      `Email: ${email}`,
      '',
      'Mensaje:',
      message,
    ].join('\n')

    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoUrl
  }

  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40 py-16 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#101f22] mb-3">Contacto</h2>
          <p className="text-[#618389]">
            ¿Tienes alguna pregunta? Estamos encantados de ayudarte con tus excursiones por Baleares.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#f0f4f4]">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary text-2xl font-bold">mail</span>
            <h3 className="text-xl font-bold">Envíanos un mensaje</h3>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#101f22]" htmlFor="name">
                Nombre Completo
              </label>
              <input
                className="w-full bg-[#f6f8f8] border-[#e2e8f0] rounded-lg px-4 py-3 text-sm focus:ring-primary focus:border-primary placeholder:text-gray-400 transition-all"
                id="name"
                name="name"
                placeholder="Ej. Juan Pérez"
                required
                type="text"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#101f22]" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                className="w-full bg-[#f6f8f8] border-[#e2e8f0] rounded-lg px-4 py-3 text-sm focus:ring-primary focus:border-primary placeholder:text-gray-400 transition-all"
                id="email"
                name="email"
                placeholder="juan@ejemplo.com"
                required
                type="email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#101f22]" htmlFor="message">
                Mensaje
              </label>
              <textarea
                className="w-full bg-[#f6f8f8] border-[#e2e8f0] rounded-lg px-4 py-3 text-sm focus:ring-primary focus:border-primary placeholder:text-gray-400 transition-all resize-none"
                id="message"
                name="message"
                placeholder="Cuéntanos cómo podemos ayudarte..."
                required
                rows="5"
              />
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                className="rounded text-primary focus:ring-primary size-4 cursor-pointer border-[#e2e8f0]"
                id="terms"
                required
                type="checkbox"
              />
              <label className="text-xs text-[#618389] leading-tight" htmlFor="terms">
                He leído y acepto la política de privacidad de BalearTrek.
              </label>
            </div>

            <button
              className="w-full py-4 bg-primary text-[#101f22] font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2"
              type="submit"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
              Enviar Mensaje
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <h4 className="text-xs font-black text-[#101f22] uppercase tracking-[0.1em] mb-6 text-center">
              Atención Directa
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">call</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#618389] uppercase tracking-wider mb-1">Llámanos</p>
                  <p className="text-base font-bold">+34 971 00 00 00</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center gap-3">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">location_on</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#618389] uppercase tracking-wider mb-1">Oficina</p>
                  <p className="text-base font-bold">Palma, Mallorca</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
