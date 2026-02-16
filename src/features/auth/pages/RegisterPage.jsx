import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../useAuth'
import AuthSecurityNotice from '../components/AuthSecurityNotice'
import AuthShell from '../components/AuthShell'
import { normalizeDniNie, normalizeEmail } from '../../../utils/validation'
import { hasIdentityFieldErrors, validateIdentityFields } from '../../../utils/identityValidation'

// Gestiona el alta de usuario validando identidad antes de enviar el registro
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

  // Envía el formulario de registro y navega a inicio si el alta fue correcta
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({ email: '', dni: '' })
    const trimmedEmail = normalizeEmail(email)
    const trimmedDni = normalizeDniNie(dni)

    const nextFieldErrors = validateIdentityFields({ email: trimmedEmail, dni: trimmedDni })

    if (hasIdentityFieldErrors(nextFieldErrors)) {
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
      navigate('/', { replace: true })
    } catch (err) {
      setError(err?.message || 'No se pudo completar el registro.')
    }
  }

  return (
    <AuthShell mode="register">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-text-main mb-2">Formulario de Registro</h1>
        <p className="text-sm text-text-muted">
          Únete a la comunidad senderista de Baleares.
        </p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-text-main">Nombre</label>
            <input
              className="w-full rounded-lg border-[#dbe4e6] focus:border-primary focus:ring-primary text-sm"
              placeholder="Ej. Joan"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-text-main">Apellidos</label>
            <input
              className="w-full rounded-lg border-[#dbe4e6] focus:border-primary focus:ring-primary text-sm"
              placeholder="Ej. Rosselló"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
        </div>
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
          {fieldErrors.email ? (
            <span className="text-xs text-rose-600">{fieldErrors.email}</span>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-text-main">DNI/NIE</label>
          <input
            className="w-full rounded-lg border-[#dbe4e6] focus:border-primary focus:ring-primary text-sm"
            placeholder="12345678X"
            type="text"
            value={dni}
            onChange={(event) => setDni(event.target.value)}
            required
          />
          {fieldErrors.dni ? (
            <span className="text-xs text-rose-600">{fieldErrors.dni}</span>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-text-main">Teléfono</label>
          <input
            className="w-full rounded-lg border-[#dbe4e6] focus:border-primary focus:ring-primary text-sm"
            placeholder="+34 600 000 000"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
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
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-text-main">Confirmar contraseña</label>
          <input
            className="w-full rounded-lg border-[#dbe4e6] focus:border-primary focus:ring-primary text-sm"
            placeholder="••••••••"
            type="password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            required
          />
        </div>
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
          {isLoading ? 'Registrando...' : 'Registrarme ahora'}
        </button>
      </form>
      <p className="text-center text-xs text-text-muted mt-6">
        Al registrarte, aceptas nuestros{' '}
        <Link className="text-primary hover:underline" to="/faq">
          Términos de Servicio
        </Link>{' '}
        y{' '}
        <Link className="text-primary hover:underline" to="/faq">
          Política de Privacidad
        </Link>.
      </p>
    </AuthShell>
  )
}
