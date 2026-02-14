import { useCallback, useEffect, useState } from 'react'
import { buildApiUrl } from '../utils/api'
import { AuthContext } from './authContext'
import { fetchCurrentUser } from './authApi'
const STORAGE_KEY = 'auth_token'
const toJson = async (response) => response.json().catch(() => ({}))
const isInvalidCredentialsResponse = (status) => status === 401 || status === 422

// Lee el token persistido en sessionStorage (solo en navegador)
const getToken = () => {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(STORAGE_KEY)
}

// Guarda el token de sesión cuando existe un valor válido
const setToken = (token) => {
  if (typeof window === 'undefined') return
  if (!token) return
  window.sessionStorage.setItem(STORAGE_KEY, token)
}

// Elimina el token de sesión almacenado localmente
const clearToken = () => {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(STORAGE_KEY)
}

// Proveedor que gestiona token y estado de carga
export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken())
  const [isLoading, setIsLoading] = useState(false)
  const [isUserLoading, setIsUserLoading] = useState(false)
  const [user, setUser] = useState(null)

  // Sincroniza token en memoria y sessionStorage
  const setSessionToken = useCallback((nextToken) => {
    if (nextToken) setToken(nextToken)
    else clearToken()
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
      const response = await fetch(buildApiUrl('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      const data = await toJson(response)
      if (!response.ok) {
        const error = new Error(
          isInvalidCredentialsResponse(response.status)
            ? 'Correo o contraseña incorrectos'
            : (data?.message || 'No se pudo iniciar sesión'),
        )
        error.status = response.status
        error.payload = data
        throw error
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
      const response = await fetch(buildApiUrl('/api/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: payload.name,
          lastname: payload.lastName,
          email: payload.email,
          password: payload.password,
          password_confirmation: payload.passwordConfirmation,
          dni: payload.dni,
          phone: payload.phone,
        }),
      })
      const data = await toJson(response)
      if (!response.ok) {
        const emailError =
          data?.errors?.email?.[0] ||
          data?.message?.toLowerCase?.().includes('email')
        if (response.status === 409 || emailError) {
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
      const token = getToken()
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
  const value = {
    token,
    isAuthenticated: Boolean(token),
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
