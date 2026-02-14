import { useAuth } from './useAuth'

export function useUser() {
  const { user, refreshUser, isUserLoading } = useAuth()
  return { user, refreshUser, isUserLoading }
}
