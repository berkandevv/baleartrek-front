const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

export function resolveImageUrl(rawImage = '') {
  if (!rawImage) return ''
  if (rawImage.startsWith('http')) return rawImage
  if (!API_BASE_URL) return rawImage
  const normalizedPath = rawImage.startsWith('/') ? rawImage : `/${rawImage}`
  return `${API_BASE_URL}${normalizedPath}`
}
