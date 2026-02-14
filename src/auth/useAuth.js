import { useContext } from 'react'
import { AuthContext } from './authContext'

// Hook de acceso al contexto global de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  // Evita usar el hook fuera del proveedor para prevenir estados inválidos
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
