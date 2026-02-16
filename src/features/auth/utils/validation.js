const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DNI_NIE_REGEX = /^(\d{8}[A-Z]|[XYZ]\d{7}[A-Z])$/

// Normaliza el email removiendo espacios sobrantes antes de validarlo o enviarlo
export const normalizeEmail = (value = '') => String(value).trim()

// Normaliza DNI/NIE en mayúsculas para validarlo con un patrón único
export const normalizeDniNie = (value = '') => String(value).trim().toUpperCase()

// Comprueba si el correo cumple el formato mínimo permitido
export const isValidEmail = (value) => EMAIL_REGEX.test(normalizeEmail(value))

// Valida que el DNI/NIE tenga estructura estándar española
export const isValidDniNie = (value) => DNI_NIE_REGEX.test(normalizeDniNie(value))
