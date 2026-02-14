import { buildApiUrl } from '../utils/api'

const toJson = async (response) => response.json().catch(() => ({}))

const buildAuthHeaders = (token, hasBody = false) => ({
  Accept: 'application/json',
  ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
})

const getErrorMessage = (payload, fallback) => payload?.message || fallback

export async function fetchCurrentUser(token) {
  const response = await fetch(buildApiUrl('/api/user'), {
    headers: buildAuthHeaders(token),
  })
  const payload = await toJson(response)
  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'No se pudo cargar el usuario'))
  }
  return payload?.data ?? null
}

export async function updateCurrentUser(token, userData) {
  const response = await fetch(buildApiUrl('/api/user'), {
    method: 'PUT',
    headers: buildAuthHeaders(token, true),
    body: JSON.stringify(userData),
  })
  const payload = await toJson(response)
  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'No se pudo guardar el perfil'))
  }
  return payload?.data ?? null
}

export async function deactivateCurrentUser(token) {
  const response = await fetch(buildApiUrl('/api/user'), {
    method: 'PUT',
    headers: buildAuthHeaders(token, true),
    body: JSON.stringify({ status: 'n' }),
  })
  const payload = await toJson(response)
  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'No se pudo eliminar la cuenta'))
  }
  return payload
}

export async function cancelMeetingSubscription(token, meetingId) {
  const response = await fetch(buildApiUrl(`/api/meetings/${meetingId}/subscribe`), {
    method: 'DELETE',
    headers: buildAuthHeaders(token),
  })
  const payload = await toJson(response)
  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'No se pudo cancelar la asistencia'))
  }
  return payload
}
