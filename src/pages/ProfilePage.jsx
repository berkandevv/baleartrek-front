import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { deactivateCurrentUser, updateCurrentUser } from '../auth/authApi'
import { useUser } from '../auth/useUser'
import ProfileSidebar from '../components/ProfileSidebar'
import { formatMemberSince, getFullName } from '../utils/profileUtils'
import { isValidDniNie, isValidEmail, normalizeDniNie, normalizeEmail } from '../utils/validation'

// Estado inicial del formulario de perfil
const emptyForm = {
  name: '',
  lastname: '',
  dni: '',
  email: '',
  phone: '',
}

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

  const memberSince = formatMemberSince(user?.created_at)
  const fullName = getFullName(user)
  const completedMeetingsCount = user?.meetings?.length ?? 0
  const meetings = user?.meetings ?? []
  const commentedMeetingsCount = meetings.filter((meeting) => (meeting?.comments ?? []).length > 0)
    .length

  // Rellena el formulario con el usuario actual cuando se carga o cambia.
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

    const nextFieldErrors = { email: '', dni: '' }
    if (!isValidEmail(trimmedEmail)) {
      nextFieldErrors.email = 'Introduce un correo electrónico válido'
    }
    if (!isValidDniNie(trimmedDni)) {
      nextFieldErrors.dni = 'Introduce un DNI o NIE válido'
    }
    if (nextFieldErrors.email || nextFieldErrors.dni) {
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
                        className="rounded-lg border-[#f0f4f4] bg-transparent focus:ring-primary focus:border-primary px-4 py-2.5"
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
                        className="rounded-lg border-[#f0f4f4] bg-transparent focus:ring-primary focus:border-primary px-4 py-2.5"
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
                        className="rounded-lg border-[#f0f4f4] bg-transparent focus:ring-primary focus:border-primary px-4 py-2.5"
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
                        className="rounded-lg border-[#f0f4f4] bg-transparent focus:ring-primary focus:border-primary px-4 py-2.5"
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
                        className="rounded-lg border-[#f0f4f4] bg-transparent focus:ring-primary focus:border-primary px-4 py-2.5"
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
                  <p className="text-2xl font-black text-text-main">0</p>
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
