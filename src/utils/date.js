export const normalizeDateInput = (value) => {
  if (!value) return null
  if (typeof value === 'string') {
    return value.split(' ')[0]
  }
  return value
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
