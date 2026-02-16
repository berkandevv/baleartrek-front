import { useAuth } from './useAuth'

// Hook de conveniencia para consumir solo datos y acciones del usuario actual
export function useUser() {
  const { user, refreshUser, isUserLoading } = useAuth()
  return { user, refreshUser, isUserLoading }
}
