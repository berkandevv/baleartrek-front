import { API_BASE_URL } from './api'

export function resolveImageUrl(rawImage = '') {
  if (!rawImage) return ''
  if (rawImage.startsWith('http')) return rawImage
  const normalizedImagePath = rawImage.startsWith('/') ? rawImage : `/${rawImage}`

  // Las rutas de assets no deben heredar el prefijo /api.
  if (normalizedImagePath.startsWith('/images/') || normalizedImagePath.startsWith('/storage/')) {
    return normalizedImagePath
  }

  if (!API_BASE_URL) return normalizedImagePath
  return `${API_BASE_URL}${normalizedImagePath}`
}
