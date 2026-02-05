const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath
}

export function resolveImageUrl(rawImage = '') {
  if (!rawImage) return ''
  if (rawImage.startsWith('http')) return rawImage
  return buildApiUrl(rawImage)
}
