import { buildApiUrl } from '../../shared/utils/api'
import { requestJson } from '../../shared/utils/httpClient'

// Construye cabeceras estándar para peticiones autenticadas
const buildAuthHeaders = (token, hasBody = false) => ({
  Accept: 'application/json',
  ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
})

// Ejecuta un POST JSON estándar para endpoints públicos de autenticación
const postPublicJson = (path, body, fallbackMessage) =>
  requestJson(
    buildApiUrl(path),
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
    fallbackMessage,
  )

// Obtiene el usuario autenticado actual
export async function fetchCurrentUser(token) {
  const payload = await requestJson(
    buildApiUrl('/api/user'),
    {
      headers: buildAuthHeaders(token),
    },
    'No se pudo cargar el usuario',
  )
  return payload?.data ?? null
}

// Actualiza los datos del perfil del usuario autenticado
export async function updateCurrentUser(token, userData) {
  const payload = await requestJson(
    buildApiUrl('/api/user'),
    {
      method: 'PUT',
      headers: buildAuthHeaders(token, true),
      body: JSON.stringify(userData),
    },
    'No se pudo guardar el perfil',
  )
  return payload?.data ?? null
}

// Cambia la contraseña del usuario autenticado
export async function updateCurrentUserPassword(token, passwordData) {
  return requestJson(
    buildApiUrl('/api/user/password'),
    {
      method: 'PUT',
      headers: buildAuthHeaders(token, true),
      body: JSON.stringify(passwordData),
    },
    'No se pudo actualizar la contraseña',
  )
}

// Marca la cuenta actual como desactivada
export async function deactivateCurrentUser(token) {
  return requestJson(
    buildApiUrl('/api/user'),
    {
      method: 'PUT',
      headers: buildAuthHeaders(token, true),
      body: JSON.stringify({ status: 'n' }),
    },
    'No se pudo eliminar la cuenta',
  )
}

// Inscribe al usuario autenticado en un encuentro concreto
export async function subscribeMeeting(token, meetingId) {
  return requestJson(
    buildApiUrl(`/api/meetings/${meetingId}/subscribe`),
    {
      method: 'POST',
      headers: buildAuthHeaders(token),
    },
    'No se pudo actualizar la suscripción',
  )
}

// Cancela la suscripción del usuario a una reunión concreta
export async function cancelMeetingSubscription(token, meetingId) {
  return requestJson(
    buildApiUrl(`/api/meetings/${meetingId}/subscribe`),
    {
      method: 'DELETE',
      headers: buildAuthHeaders(token),
    },
    'No se pudo cancelar la asistencia',
  )
}

// Intenta login y devuelve payload incluyendo errores para manejo contextual
export async function loginRequest(credentials) {
  return postPublicJson('/api/login', credentials, 'No se pudo iniciar sesión')
}

// Intenta registro y devuelve payload incluyendo errores para manejo contextual
export async function registerRequest(payload) {
  return postPublicJson('/api/register', payload, 'Error en el registro')
}
