import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

// Componente que protege rutas privadas según el estado de autenticación
export default function ProtectedRoute({ children }) {
  const { token, isAuthenticated, isLoading, isUserLoading } = useAuth()
  const isCheckingSession = isLoading || (Boolean(token) && isUserLoading)

  // Mientras se valida la sesión, se muestra un estado de carga
  if (isCheckingSession) {
    return (
      <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-8">
        <div className="rounded-lg border border-[#f0f4f4] dark:border-white/10 bg-[#f6f8f8] dark:bg-white/5 px-4 py-3 text-sm text-text-sub">
          Comprobando sesión...
        </div>
      </div>
    )
  }

  // Si no hay sesión activa, redirige al login
  if (!isAuthenticated) {
    return <Navigate replace to="/login" />
  }

  // Con sesión válida, renderiza el contenido protegido
  return children
}
