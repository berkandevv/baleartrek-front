const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DNI_NIE_REGEX = /^(\d{8}[A-Z]|[XYZ]\d{7}[A-Z])$/

export const normalizeEmail = (value = '') => String(value).trim()

export const normalizeDniNie = (value = '') => String(value).trim().toUpperCase()

export const isValidEmail = (value) => EMAIL_REGEX.test(normalizeEmail(value))

export const isValidDniNie = (value) => DNI_NIE_REGEX.test(normalizeDniNie(value))
