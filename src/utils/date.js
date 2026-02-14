export const normalizeDateInput = (value) => {
  if (!value) return null
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null
    return value.toISOString().slice(0, 10)
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})/)
    if (match) return match[1]
    return trimmed.split(' ')[0] || null
  }
  return null
}

export const formatSpanishShortDate = (value) => {
  const safeDay = normalizeDateInput(value)
  if (!safeDay) return 'Fecha pendiente'
  const date = new Date(`${safeDay}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  const formatted = date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  return formatted.replace('.', '')
}
