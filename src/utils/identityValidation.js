import { isValidDniNie, isValidEmail } from './validation'

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

export const hasIdentityFieldErrors = (fieldErrors) => Boolean(fieldErrors.email || fieldErrors.dni)
