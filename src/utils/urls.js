import { API_BASE_URL, buildApiUrl } from './api'

export function resolveImageUrl(rawImage = '') {
  if (!rawImage) return ''
  if (rawImage.startsWith('http')) return rawImage
  if (!API_BASE_URL) return rawImage
  return buildApiUrl(rawImage)
}
