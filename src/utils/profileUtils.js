// Formatea el texto de "Miembro desde" con mes y año en español
export const formatMemberSince = (createdAt) => {
  if (!createdAt) return null
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return null
  const formatted = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
  return formatted ? `${formatted.charAt(0).toUpperCase()}${formatted.slice(1)}` : formatted
}

// Construye el nombre completo uniendo nombre y apellidos disponibles
export const getFullName = (user) => {
  if (!user) return ''
  return [user.name, user.lastname].filter(Boolean).join(' ')
}
