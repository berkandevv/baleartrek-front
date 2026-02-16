export const parseJsonSafe = async (response) => response.json().catch(() => ({}))

export const buildHttpError = (response, payload, fallbackMessage) => {
  const error = new Error(payload?.message || fallbackMessage)
  error.status = response.status
  error.payload = payload
  return error
}

export const requestJson = async (url, options, fallbackMessage) => {
  const response = await fetch(url, options)
  const payload = await parseJsonSafe(response)

  if (!response.ok) {
    throw buildHttpError(response, payload, fallbackMessage || 'Error en la petición')
  }

  return payload
}
