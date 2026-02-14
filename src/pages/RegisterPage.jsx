import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { isValidDniNie, isValidEmail, normalizeDniNie, normalizeEmail } from '../utils/validation'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dni, setDni] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ email: '', dni: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({ email: '', dni: '' })
    const trimmedEmail = normalizeEmail(email)
    const trimmedDni = normalizeDniNie(dni)

    const nextFieldErrors = { email: '', dni: '' }
    if (!isValidEmail(trimmedEmail)) {
      nextFieldErrors.email = 'Introduce un correo electrónico válido'
    }

    if (!isValidDniNie(trimmedDni)) {
      nextFieldErrors.dni = 'Introduce un DNI o NIE válido'
    }

    if (nextFieldErrors.email || nextFieldErrors.dni) {
      setFieldErrors(nextFieldErrors)
      return
    }

    try {
      await register({
        name,
        lastName,
        email: trimmedEmail,
        password,
        passwordConfirmation,
        dni: trimmedDni,
        phone,
      })
      navigate('/login', {
        state: { successMessage: 'Registro completado. Ahora inicia sesión para entrar.' },
      })
    } catch (err) {
      setError(err?.message || 'No se pudo completar el registro.')
    }
  }

  return (
    <main className="flex-grow flex items-start justify-center px-4 pt-10 pb-16">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#1a2c30] rounded-xl shadow-xl border border-[#dbe4e6] dark:border-[#2a3c40] overflow-hidden">
          <div className="flex border-b border-[#dbe4e6] dark:border-[#2a3c40]">
            <Link
              className="flex-1 py-4 text-sm font-bold text-[#618389] dark:text-gray-400 hover:text-primary transition-colors border-b-2 border-transparent text-center"
              to="/login"
            >
              Iniciar Sesión
            </Link>
            <Link
              className="flex-1 py-4 text-sm font-bold text-primary border-b-2 border-primary text-center"
              to="/registro"
            >
              Crear Cuenta
            </Link>
          </div>
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-text-main dark:text-white mb-2">Formulario de Registro</h1>
              <p className="text-sm text-text-muted dark:text-gray-400">
                Únete a la comunidad senderista de Baleares.
              </p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-text-main dark:text-white">Nombre</label>
                  <input
                    className="w-full rounded-lg border-[#dbe4e6] dark:border-[#2a3c40] dark:bg-[#101f22] focus:border-primary focus:ring-primary text-sm"
                    placeholder="Ej. Joan"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-text-main dark:text-white">Apellidos</label>
                  <input
                    className="w-full rounded-lg border-[#dbe4e6] dark:border-[#2a3c40] dark:bg-[#101f22] focus:border-primary focus:ring-primary text-sm"
                    placeholder="Ej. Rosselló"
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-text-main dark:text-white">Correo Electrónico</label>
                <input
                  className="w-full rounded-lg border-[#dbe4e6] dark:border-[#2a3c40] dark:bg-[#101f22] focus:border-primary focus:ring-primary text-sm"
                  placeholder="nombre@ejemplo.com"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                {fieldErrors.email ? (
                  <span className="text-xs text-rose-600 dark:text-rose-300">{fieldErrors.email}</span>
                ) : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-text-main dark:text-white">DNI/NIE</label>
                <input
                  className="w-full rounded-lg border-[#dbe4e6] dark:border-[#2a3c40] dark:bg-[#101f22] focus:border-primary focus:ring-primary text-sm"
                  placeholder="12345678X"
                  type="text"
                  value={dni}
                  onChange={(event) => setDni(event.target.value)}
                  required
                />
                {fieldErrors.dni ? (
                  <span className="text-xs text-rose-600 dark:text-rose-300">{fieldErrors.dni}</span>
                ) : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-text-main dark:text-white">Teléfono</label>
                <input
                  className="w-full rounded-lg border-[#dbe4e6] dark:border-[#2a3c40] dark:bg-[#101f22] focus:border-primary focus:ring-primary text-sm"
                  placeholder="+34 600 000 000"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-text-main dark:text-white">Contraseña</label>
                <input
                  className="w-full rounded-lg border-[#dbe4e6] dark:border-[#2a3c40] dark:bg-[#101f22] focus:border-primary focus:ring-primary text-sm"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-text-main dark:text-white">Confirmar contraseña</label>
                <input
                  className="w-full rounded-lg border-[#dbe4e6] dark:border-[#2a3c40] dark:bg-[#101f22] focus:border-primary focus:ring-primary text-sm"
                  placeholder="••••••••"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(event) => setPasswordConfirmation(event.target.value)}
                  required
                />
              </div>
              {error ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200">
                  {error}
                </div>
              ) : null}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30 flex gap-3">
                <span className="material-symbols-outlined text-blue-500 text-xl">info</span>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                    Aviso de seguridad
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                    Recuerda que nuestro sistema distingue entre <strong>mayúsculas y minúsculas</strong>. Asegúrate de
                    guardarlas correctamente para evitar errores al iniciar sesión.
                  </p>
                </div>
              </div>
              <button
                className="w-full flex items-center justify-center rounded-lg h-12 bg-primary text-[#111718] hover:bg-[#11b5d6] transition-all transform hover:scale-[1.01] shadow-lg shadow-primary/20 text-base font-bold tracking-[0.015em] mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Registrando...' : 'Registrarme ahora'}
              </button>
            </form>
              <p className="text-center text-xs text-text-muted dark:text-gray-500 mt-6">
                Al registrarte, aceptas nuestros{' '}
                <Link className="text-primary hover:underline" to="/faq">
                  Términos de Servicio
                </Link>{' '}
                y{' '}
                <Link className="text-primary hover:underline" to="/faq">
                  Política de Privacidad
                </Link>.
              </p>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-text-muted dark:text-gray-400">
          <span className="material-symbols-outlined text-sm">help</span>
          <p className="text-sm">
            ¿Necesitas ayuda?{' '}
            <Link className="text-primary font-bold hover:underline" to="/contacto">
              Contactar soporte
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
