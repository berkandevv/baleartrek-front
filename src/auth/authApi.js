import { buildApiUrl } from '../utils/api'

// Intenta parsear JSON y devuelve objeto vacío si la respuesta no es JSON válido
const toJson = async (response) => response.json().catch(() => ({}))

// Construye cabeceras estándar para peticiones autenticadas
const buildAuthHeaders = (token, hasBody = false) => ({
  Accept: 'application/json',
  ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
})

// Prioriza mensajes del backend y usa fallback si no existen
const getErrorMessage = (payload, fallback) => payload?.message || fallback
const buildApiError = (response, payload, fallback) => {
  const error = new Error(getErrorMessage(payload, fallback))
  error.status = response.status
  error.payload = payload
  return error
}

// Obtiene el usuario autenticado actual
export async function fetchCurrentUser(token) {
  const response = await fetch(buildApiUrl('/api/user'), {
    headers: buildAuthHeaders(token),
  })
  const payload = await toJson(response)
  if (!response.ok) {
    throw buildApiError(response, payload, 'No se pudo cargar el usuario')
  }
  return payload?.data ?? null
}

// Actualiza los datos del perfil del usuario autenticado
export async function updateCurrentUser(token, userData) {
  const response = await fetch(buildApiUrl('/api/user'), {
    method: 'PUT',
    headers: buildAuthHeaders(token, true),
    body: JSON.stringify(userData),
  })
  const payload = await toJson(response)
  if (!response.ok) {
    throw buildApiError(response, payload, 'No se pudo guardar el perfil')
  }
  return payload?.data ?? null
}

// Marca la cuenta actual como desactivada
export async function deactivateCurrentUser(token) {
  const response = await fetch(buildApiUrl('/api/user'), {
    method: 'PUT',
    headers: buildAuthHeaders(token, true),
    body: JSON.stringify({ status: 'n' }),
  })
  const payload = await toJson(response)
  if (!response.ok) {
    throw buildApiError(response, payload, 'No se pudo eliminar la cuenta')
  }
  return payload
}

// Cancela la suscripción del usuario a una reunión concreta
export async function cancelMeetingSubscription(token, meetingId) {
  const response = await fetch(buildApiUrl(`/api/meetings/${meetingId}/subscribe`), {
    method: 'DELETE',
    headers: buildAuthHeaders(token),
  })
  const payload = await toJson(response)
  if (!response.ok) {
    throw buildApiError(response, payload, 'No se pudo cancelar la asistencia')
  }
  return payload
}
