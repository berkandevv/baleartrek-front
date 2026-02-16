import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthSecurityNotice from '../components/AuthSecurityNotice'
import AuthShell from '../components/AuthShell'

// Gestiona el inicio de sesión y traduce errores comunes a mensajes útiles
export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const successMessage = location.state?.successMessage ?? ''
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Ejecuta login y clasifica errores de red/credenciales para mostrar feedback claro
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
      const message = String(err?.message || '')
      const isNetworkError =
        message === 'Failed to fetch' ||
        message.includes('NetworkError') ||
        (err?.name === 'TypeError' && !err?.status)
      if (isNetworkError) {
        const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false
        setError(
          isOffline
            ? 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.'
            : 'Correo o contraseña incorrectos.',
        )
        return
      }
      setError(message || 'Error de credenciales')
    }
  }

  return (
    <AuthShell mode="login">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-text-main mb-2">Bienvenido de nuevo</h1>
        <p className="text-sm text-text-muted">
          Introduce tus credenciales para acceder a tu cuenta.
        </p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-text-main">Correo Electrónico</label>
          <input
            className="w-full rounded-lg border-[#dbe4e6] focus:border-primary focus:ring-primary text-sm"
            placeholder="nombre@ejemplo.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-text-main">Contraseña</label>
          <input
            className="w-full rounded-lg border-[#dbe4e6] focus:border-primary focus:ring-primary text-sm"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {successMessage ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}
        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        <AuthSecurityNotice />
        <button
          className="w-full flex items-center justify-center rounded-lg h-12 bg-primary text-[#111718] hover:bg-[#11b5d6] transition-all transform hover:scale-[1.01] shadow-lg shadow-primary/20 text-base font-bold tracking-[0.015em] mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </AuthShell>
  )
}
