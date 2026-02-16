import { isValidDniNie, isValidEmail } from './validation'

// Valida email y DNI/NIE devolviendo mensajes de error por campo
export const validateIdentityFields = ({ email, dni }) => {
  const fieldErrors = { email: '', dni: '' }

  if (!isValidEmail(email)) {
    fieldErrors.email = 'Introduce un correo electrónico válido'
  }
  if (!isValidDniNie(dni)) {
    fieldErrors.dni = 'Introduce un DNI o NIE válido'
  }

  return fieldErrors
}

// Indica si existe al menos un error de validación en el formulario de identidad
export const hasIdentityFieldErrors = (fieldErrors) => Boolean(fieldErrors.email || fieldErrors.dni)
