// Intenta parsear JSON sin romper el flujo cuando la respuesta no trae cuerpo válido
export const parseJsonSafe = async (response) => response.json().catch(() => ({}))

// Crea un error enriquecido con status y payload para manejarlo en capas superiores
export const buildHttpError = (response, payload, fallbackMessage) => {
  const error = new Error(payload?.message || fallbackMessage)
  error.status = response.status
  error.payload = payload
  return error
}

// Ejecuta una petición fetch y devuelve JSON lanzando errores de negocio consistentes
export const requestJson = async (url, options, fallbackMessage) => {
  const response = await fetch(url, options)
  const payload = await parseJsonSafe(response)

  if (!response.ok) {
    throw buildHttpError(response, payload, fallbackMessage || 'Error en la petición')
  }

  return payload
}
