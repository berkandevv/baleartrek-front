const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DNI_NIE_REGEX = /^(\d{8}[A-Z]|[XYZ]\d{7}[A-Z])$/
const DNI_NIE_CONTROL = 'TRWAGMYFPDXBNJZSQVHLCKE'

// Normaliza el email removiendo espacios sobrantes antes de validarlo o enviarlo
export const normalizeEmail = (value = '') => String(value).trim()

// Normaliza DNI/NIE en mayúsculas para validarlo con un patrón único
export const normalizeDniNie = (value = '') => String(value).trim().toUpperCase()

// Comprueba si el correo cumple el formato mínimo permitido
export const isValidEmail = (value) => EMAIL_REGEX.test(normalizeEmail(value))

// Valida estructura y letra de control del DNI/NIE español
export const isValidDniNie = (value) => {
  const normalized = normalizeDniNie(value)
  if (!DNI_NIE_REGEX.test(normalized)) return false

  const firstChar = normalized[0]
  const numberPart =
    firstChar === 'X'
      ? `0${normalized.slice(1, 8)}`
      : firstChar === 'Y'
        ? `1${normalized.slice(1, 8)}`
        : firstChar === 'Z'
          ? `2${normalized.slice(1, 8)}`
          : normalized.slice(0, 8)

  const controlLetter = normalized.slice(-1)
  const index = Number.parseInt(numberPart, 10) % 23
  return DNI_NIE_CONTROL[index] === controlLetter
}
