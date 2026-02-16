import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { deactivateCurrentUser, updateCurrentUser, updateCurrentUserPassword } from '../../auth/api/authApi'
import { useUser } from '../../auth/hooks/useUser'
import ProfileSidebar from '../components/ProfileSidebar'
import { getMeetingDateValue } from '../utils/profileCommentsUtils'
import { formatMemberSince } from '../utils/profileUtils'
import { normalizeDniNie, normalizeEmail } from '../../auth/utils/validation'
import { hasIdentityFieldErrors, validateIdentityFields } from '../../auth/utils/identityValidation'
import { formatFullName } from '../../shared/utils/formatters'

// Estado inicial del formulario de perfil
const emptyForm = {
  name: '',
  lastname: '',
  dni: '',
  email: '',
  phone: '',
}
const emptyPasswordForm = {
  currentPassword: '',
  password: '',
  passwordConfirmation: '',
}

// Gestiona edición de perfil, cambio de contraseña y baja de cuenta del usuario autenticado
export default function ProfilePage() {
  // Datos de autenticacion para proteger el acceso al perfil
  const { token, isAuthenticated, logout } = useAuth()
  const { user, isUserLoading } = useUser()
  // Estado local del formulario y mensajes de la UI
  const [form, setForm] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ email: '', dni: '' })
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false)

  const memberSince = formatMemberSince(user?.created_at)
  const fullName = formatFullName(user)
  const completedMeetingsCount = user?.meetings?.length ?? 0
  const meetings = user?.meetings ?? []
  const nowValue = Date.now()
  const upcomingMeetingsCount = meetings.filter((meeting) => {
    const dateValue = getMeetingDateValue(meeting)
    return !dateValue || dateValue >= nowValue
  }).length
  const commentedMeetingsCount = meetings.filter((meeting) => (meeting?.comments ?? []).length > 0)
    .length

  // Rellena el formulario con el usuario actual cuando se carga o cambia
  useEffect(() => {
    if (!user) {
      setForm(emptyForm)
      return
    }

    setForm({
      name: user?.name ?? '',
      lastname: user?.lastname ?? '',
      dni: user?.dni ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    })
  }, [user])

  // Actualiza el estado del formulario y limpia errores de campo
  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'email' || name === 'dni') {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Valida y guarda los cambios del perfil
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!token) return

    setIsSaving(true)
    setError('')
    setSuccess('')
    setFieldErrors({ email: '', dni: '' })

    const trimmedEmail = normalizeEmail(form.email)
    const trimmedDni = normalizeDniNie(form.dni)

    const nextFieldErrors = validateIdentityFields({ email: trimmedEmail, dni: trimmedDni })
    if (hasIdentityFieldErrors(nextFieldErrors)) {
      setFieldErrors(nextFieldErrors)
      setIsSaving(false)
      return
    }

    try {
      const data = await updateCurrentUser(token, {
        name: form.name,
        lastname: form.lastname,
        dni: trimmedDni,
        email: trimmedEmail,
        phone: form.phone,
      })
      if (data) {
        setForm({
          name: data?.name ?? '',
          lastname: data?.lastname ?? '',
          dni: data?.dni ?? '',
          email: data?.email ?? '',
          phone: data?.phone ?? '',
        })
      }
      setForm((prev) => ({
        ...prev,
        dni: trimmedDni,
        email: trimmedEmail,
      }))
      setSuccess('Datos guardados correctamente')
    } catch (saveError) {
      console.error('Error al guardar perfil:', saveError)
      setError(saveError?.message || 'No se pudo guardar el perfil')
    } finally {
      setIsSaving(false)
    }
  }

  // Solicita confirmación y desactiva la cuenta del usuario antes de cerrar sesión
  const handleDelete = async () => {
    if (!token) return
    const confirmed = window.confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')
    if (!confirmed) return
    setIsDeleting(true)
    setError('')
    setSuccess('')
    try {
      await deactivateCurrentUser(token)
      await logout()
    } catch (deleteError) {
      console.error('Error al eliminar cuenta:', deleteError)
      setError(deleteError?.message || 'No se pudo eliminar la cuenta')
    } finally {
      setIsDeleting(false)
    }
  }

  // Actualiza el formulario de contraseñas sin mezclarlo con el formulario de perfil
  const handlePasswordChange = (event) => {
    const { name, value } = event.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  // Envía el cambio de contraseña validando coincidencia entre nueva clave y confirmación
  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    if (!token) return

    setPasswordError('')
    setPasswordSuccess('')

    if (passwordForm.password !== passwordForm.passwordConfirmation) {
      setPasswordError('La nueva contraseña y su confirmación no coinciden')
      return
    }

    setIsChangingPassword(true)
    try {
      await updateCurrentUserPassword(token, {
        current_password: passwordForm.currentPassword,
        password: passwordForm.password,
        password_confirmation: passwordForm.passwordConfirmation,
      })
      setPasswordForm(emptyPasswordForm)
      setPasswordSuccess('Contraseña actualizada correctamente')
    } catch (changePasswordError) {
      console.error('Error al cambiar contraseña:', changePasswordError)
      setPasswordError(changePasswordError?.message || 'No se pudo actualizar la contraseña')
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <ProfileSidebar fullName={fullName} memberSince={memberSince} />

        <main className="flex-1 flex flex-col gap-8 max-w-4xl">
          <div className="flex flex-col gap-2">
            <h1 className="text-text-main text-4xl font-black leading-tight tracking-[-0.033em]">
              Mi Perfil
            </h1>
            <p className="text-text-sub text-base font-normal leading-normal">
              Gestiona tus datos personales y revisa tu actividad en BalearTrek.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#f0f4f4] overflow-hidden shadow-sm">
            <div className="p-6 sm:p-8 flex flex-col gap-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <p className="text-text-main text-xl font-bold leading-tight">
                      {fullName || 'Tu perfil'}
                    </p>
                    <p className="text-text-sub text-sm font-normal">Datos personales y de contacto</p>
                  </div>
                </div>
              </div>
              <hr className="border-[#f0f4f4]" />

              {!isAuthenticated ? (
                <div className="rounded-lg border border-[#f0f4f4] bg-[#f6f8f8] px-4 py-3 text-sm text-text-sub">
                  Inicia sesión para ver y editar tu perfil.
                </div>
              ) : isUserLoading ? (
                <div className="rounded-lg border border-[#f0f4f4] bg-[#f6f8f8] px-4 py-3 text-sm text-text-sub">
                  Cargando datos del perfil...
                </div>
              ) : (
                <div>
                  <h2 className="text-text-main text-lg font-bold mb-6">
                    Mis Datos Personales
                  </h2>

                  {error ? (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  ) : null}

                  {success ? (
                    <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {success}
                    </div>
                  ) : null}

                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-text-main" htmlFor="name">
                        Nombre
                      </label>
                      <input
                        id="name"
                        name="name"
                        className="rounded-lg border-[#cfe1de] bg-white text-text-main placeholder:text-text-sub focus:ring-primary focus:border-primary px-4 py-2.5"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-text-main" htmlFor="lastname">
                        Apellidos
                      </label>
                      <input
                        id="lastname"
                        name="lastname"
                        className="rounded-lg border-[#cfe1de] bg-white text-text-main placeholder:text-text-sub focus:ring-primary focus:border-primary px-4 py-2.5"
                        type="text"
                        value={form.lastname}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-text-main" htmlFor="dni">
                        DNI / NIE
                      </label>
                      <input
                        id="dni"
                        name="dni"
                        className="rounded-lg border-[#cfe1de] bg-white text-text-main placeholder:text-text-sub focus:ring-primary focus:border-primary px-4 py-2.5"
                        type="text"
                        value={form.dni}
                        onChange={handleChange}
                      />
                      {fieldErrors.dni ? (
                        <span className="text-xs text-rose-600">{fieldErrors.dni}</span>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-text-main" htmlFor="phone">
                        Teléfono de Contacto
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        className="rounded-lg border-[#cfe1de] bg-white text-text-main placeholder:text-text-sub focus:ring-primary focus:border-primary px-4 py-2.5"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-sm font-bold text-text-main" htmlFor="email">
                        Correo Electrónico
                      </label>
                      <input
                        id="email"
                        name="email"
                        className="rounded-lg border-[#cfe1de] bg-white text-text-main placeholder:text-text-sub focus:ring-primary focus:border-primary px-4 py-2.5"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                      />
                      {fieldErrors.email ? (
                        <span className="text-xs text-rose-600">{fieldErrors.email}</span>
                      ) : null}
                    </div>
                    <div className="md:col-span-2 flex flex-col sm:flex-row justify-between gap-3 mt-4">
                      <button
                        className="bg-rose-600 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-sm transition-all hover:bg-rose-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Eliminando...' : 'Eliminar cuenta'}
                      </button>
                      <button
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isSaving}
                      >
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                    </div>
                  </form>

                  <hr className="my-8 border-[#f0f4f4]" />

                  <div className="rounded-xl border border-[#d7e7e4] bg-[#f3f9f8]">
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-left bg-[#e6f3f1] hover:bg-[#d7ece8] transition-colors rounded-t-xl"
                      type="button"
                      onClick={() => setIsPasswordSectionOpen((prev) => !prev)}
                      aria-expanded={isPasswordSectionOpen}
                      aria-controls="password-section"
                    >
                      <span className="text-[#0c3d38] text-lg font-bold">Cambiar contraseña</span>
                      <span className="material-symbols-outlined text-[#0c3d38]">
                        {isPasswordSectionOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>

                    {isPasswordSectionOpen ? (
                      <div id="password-section" className="border-t border-[#f0f4f4] p-4 sm:p-6">
                        {passwordError ? (
                          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {passwordError}
                          </div>
                        ) : null}

                        {passwordSuccess ? (
                          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {passwordSuccess}
                          </div>
                        ) : null}

                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handlePasswordSubmit}>
                          <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-bold text-text-main" htmlFor="currentPassword">
                              Contraseña actual
                            </label>
                            <input
                              id="currentPassword"
                              name="currentPassword"
                              className="rounded-lg border-[#cfe1de] bg-white text-text-main placeholder:text-text-sub focus:ring-primary focus:border-primary px-4 py-2.5"
                              type="password"
                              value={passwordForm.currentPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-text-main" htmlFor="password">
                              Nueva contraseña
                            </label>
                            <input
                              id="password"
                              name="password"
                              className="rounded-lg border-[#cfe1de] bg-white text-text-main placeholder:text-text-sub focus:ring-primary focus:border-primary px-4 py-2.5"
                              type="password"
                              value={passwordForm.password}
                              onChange={handlePasswordChange}
                              minLength={8}
                              required
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-text-main" htmlFor="passwordConfirmation">
                              Confirmar nueva contraseña
                            </label>
                            <input
                              id="passwordConfirmation"
                              name="passwordConfirmation"
                              className="rounded-lg border-[#cfe1de] bg-white text-text-main placeholder:text-text-sub focus:ring-primary focus:border-primary px-4 py-2.5"
                              type="password"
                              value={passwordForm.passwordConfirmation}
                              onChange={handlePasswordChange}
                              minLength={8}
                              required
                            />
                          </div>
                          <div className="md:col-span-2 flex justify-end">
                            <button
                              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                              type="submit"
                              disabled={isChangingPassword}
                            >
                              {isChangingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-text-main text-[22px] font-bold leading-tight tracking-[-0.015em] px-1">
              Resumen de Actividad
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl border border-[#f0f4f4] flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">hiking</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-2xl font-black text-text-main">{completedMeetingsCount}</p>
                  <p className="text-sm text-text-sub font-medium">Rutas Completadas</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-[#f0f4f4] flex items-center gap-4">
                <div className="size-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                  <span className="material-symbols-outlined">star</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-2xl font-black text-[#111718]">
                    {commentedMeetingsCount}
                  </p>
                  <p className="text-sm text-[#618389] font-medium">Valoraciones</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-[#f0f4f4] flex items-center gap-4">
                <div className="size-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <span className="material-symbols-outlined">event_available</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-2xl font-black text-text-main">{upcomingMeetingsCount}</p>
                  <p className="text-sm text-text-sub font-medium">Próximos Encuentros</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-10" />
        </main>
      </div>
    </div>
  )
}
