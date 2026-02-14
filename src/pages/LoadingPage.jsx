import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function LoadingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const successMessage = location.state?.successMessage ?? ''
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      if (err?.message === 'Cuenta eliminada') {
        setError('Cuenta eliminada')
        return
      }
      if (err?.message === 'Failed to fetch' || err?.name === 'TypeError') {
        setError('Error de credenciales')
        return
      }
      setError(err?.message || 'Error de credenciales')
    }
  }

  return (
    <main className="flex-grow flex items-start justify-center px-4 pt-10 pb-16">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#1a2c30] rounded-xl shadow-xl border border-[#dbe4e6] dark:border-[#2a3c40] overflow-hidden">
          <div className="flex border-b border-[#dbe4e6] dark:border-[#2a3c40]">
            <Link
              className="flex-1 py-4 text-sm font-bold text-primary border-b-2 border-primary text-center"
              to="/login"
            >
              Iniciar Sesión
            </Link>
            <Link
              className="flex-1 py-4 text-sm font-bold text-[#618389] dark:text-gray-400 hover:text-primary transition-colors border-b-2 border-transparent text-center"
              to="/registro"
            >
              Crear Cuenta
            </Link>
          </div>
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-text-main dark:text-white mb-2">Bienvenido de nuevo</h1>
              <p className="text-sm text-text-muted dark:text-gray-400">
                Introduce tus credenciales para acceder a tu cuenta.
              </p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
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
              <div className="flex items-center justify-end">
                <Link className="text-sm font-medium text-primary hover:underline" to="/contacto">
                  ¿Has olvidado tu contraseña?
                </Link>
              </div>
              {successMessage ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
                  {successMessage}
                </div>
              ) : null}
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
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
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
