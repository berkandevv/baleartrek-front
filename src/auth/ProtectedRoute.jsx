import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-8">
        <div className="rounded-lg border border-[#f0f4f4] dark:border-white/10 bg-[#f6f8f8] dark:bg-white/5 px-4 py-3 text-sm text-text-sub">
          Comprobando sesión...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />
  }

  return children
}
