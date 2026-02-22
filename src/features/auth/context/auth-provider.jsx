import { useCallback, useEffect, useState } from 'react'
import { buildApiUrl } from '../../shared/utils/api'
import { AuthContext } from './auth-context'
import { fetchCurrentUser, loginRequest, registerRequest } from '../api/authApi'

// Proveedor que gestiona token y estado de carga
export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUserLoading, setIsUserLoading] = useState(false)
  const [user, setUser] = useState(null)

  // Mantiene el token exclusivamente en memoria para reducir superficie de XSS
  const setSessionToken = useCallback((nextToken) => {
    setTokenState(nextToken ?? null)
  }, [])

  const refreshUser = useCallback(async (tokenToUse = token) => {
    if (!tokenToUse) {
      setUser(null)
      return null
    }

    // Actualiza el perfil autenticado para mantener el estado sincronizado
    setIsUserLoading(true)
    try {
      const nextUser = await fetchCurrentUser(tokenToUse)
      if (nextUser?.status === 'n') {
        setSessionToken(null)
        setUser(null)
        throw new Error('Cuenta eliminada')
      }
      setUser(nextUser)
      return nextUser
    } catch (error) {
      const message = String(error?.message ?? '').toLowerCase()
      const isUnauthorized =
        error?.status === 401 ||
        error?.status === 403 ||
        message.includes('unauthenticated') ||
        message.includes('unauthorized')
      if (isUnauthorized) {
        setSessionToken(null)
      }
      setUser(null)
      throw error
    } finally {
      setIsUserLoading(false)
    }
  }, [token, setSessionToken])

  // Carga datos del usuario cuando hay token disponible
  useEffect(() => {
    if (!token) {
      setUser(null)
      return
    }

    refreshUser(token).catch((error) => {
      if (error?.message !== 'Cuenta eliminada' && error?.status !== 401 && error?.status !== 403) {
        console.error('Error al cargar usuario:', error)
      }
    })
  }, [token, refreshUser])

  // Ejecuta login y guarda token
  const login = async (credentials) => {
    setIsLoading(true)
    try {
      let data = null
      try {
        data = await loginRequest(credentials)
      } catch (requestError) {
        const responseStatus = requestError?.status
        const authError = new Error(
          responseStatus === 422
            ? 'Correo o contraseña incorrectos'
            : responseStatus === 403
            ? 'Usuario eliminado'
            : (requestError?.payload?.message || 'No se pudo iniciar sesión'),
        )
        authError.status = responseStatus
        authError.payload = requestError?.payload
        throw authError
      }
      const nextToken = data?.token || null
      if (nextToken) {
        setSessionToken(nextToken)
        try {
          await refreshUser(nextToken)
        } catch (error) {
          if (error?.message === 'Cuenta eliminada') {
            throw error
          }
        }
      }
      return data
    } finally {
      setIsLoading(false)
    }
  }

  // Ejecuta registro y guarda token
  const register = async (payload) => {
    setIsLoading(true)
    try {
      const requestPayload = {
        name: payload.name,
        lastname: payload.lastName,
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.passwordConfirmation,
        dni: payload.dni,
        phone: payload.phone,
      }
      let data = null
      try {
        data = await registerRequest(requestPayload)
      } catch (error) {
        const emailError =
          error?.payload?.errors?.email?.[0] ||
          error?.payload?.message?.toLowerCase?.().includes('email')
        if (error?.status === 409 || emailError) {
          throw new Error('El correo electrónico ya está en uso')
        }
        throw new Error('Error en el registro')
      }
      const nextToken = data?.token || null
      if (nextToken) setSessionToken(nextToken)
      return data
    } finally {
      setIsLoading(false)
    }
  }

  // Ejecuta logout y limpia token local
  const logout = async () => {
    setIsLoading(true)
    try {
      await fetch(buildApiUrl('/api/logout'), {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
    } finally {
      setSessionToken(null)
      setUser(null)
      setIsLoading(false)
      if (typeof window !== 'undefined') {
        window.location.assign('/')
      }
    }
  }

  // Valor que se expone a los consumidores del contexto
  const isAuthenticated = Boolean(token) && (Boolean(user) || isUserLoading)

  const value = {
    token,
    isAuthenticated,
    user,
    isUserLoading,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }

  // Proveedor del contexto que envuelve la app
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
