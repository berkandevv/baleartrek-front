const normalizeBaseUrl = (value = '') => {
  const trimmed = String(value).trim().replace(/\/+$/, '')
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

const getBasePathname = (baseUrl) => {
  if (!baseUrl) return ''
  try {
    const parsed = new URL(baseUrl)
    return parsed.pathname.replace(/\/+$/, '')
  } catch {
    return baseUrl.startsWith('/') ? baseUrl.replace(/\/+$/, '') : ''
  }
}

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL ?? '')

export const buildApiUrl = (path = '') => {
  if (!path) return API_BASE_URL || ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (!API_BASE_URL) return path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const basePathname = getBasePathname(API_BASE_URL)

  let pathToAppend = normalizedPath
  if (basePathname && basePathname !== '/') {
    if (pathToAppend === basePathname) {
      pathToAppend = ''
    } else if (pathToAppend.startsWith(`${basePathname}/`)) {
      pathToAppend = pathToAppend.slice(basePathname.length)
    }
  }

  return `${API_BASE_URL}${pathToAppend}`
}
