import { createContext, useContext, useEffect, useState } from 'react'
const STORAGE_KEY = 'auth_token'

const getToken = () => {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(STORAGE_KEY)
}

const setToken = (token) => {
  if (typeof window === 'undefined') return
  if (!token) return
  window.sessionStorage.setItem(STORAGE_KEY, token)
}

const clearToken = () => {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(STORAGE_KEY)
}

// Contexto de autenticación compartido en la app
const AuthContext = createContext(null)

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

const buildUrl = (path) => (API_BASE_URL ? `${API_BASE_URL}${path}` : path)

// Proveedor que gestiona token y estado de carga
export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken())
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)

  // Sincroniza token en memoria y sessionStorage
  const setSessionToken = (nextToken) => {
    if (nextToken) setToken(nextToken)
    else clearToken()
    setTokenState(nextToken ?? null)
  }

  // Carga datos del usuario cuando hay token disponible
  useEffect(() => {
    if (!token) {
      setUser(null)
      return
    }

    let isActive = true
    const fetchUser = async () => {
      try {
        const response = await fetch(buildUrl('/api/user'), {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        const payload = await response.json()
        if (!response.ok) throw new Error('No se pudo cargar el usuario')
        if (isActive) {
          const nextUser = payload?.data ?? null
          if (nextUser?.status === 'n') {
            setSessionToken(null)
            setUser(null)
          } else {
            setUser(nextUser)
          }
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error)
        if (isActive) {
          setUser(null)
        }
      }
    }

    fetchUser()

    return () => {
      isActive = false
    }
  }, [token])

  // Ejecuta login y guarda token
  const login = async (credentials) => {
    setIsLoading(true)
    try {
      const response = await fetch(buildUrl('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      const data = await response.json()
      if (!response.ok) throw new Error('Error de credenciales')
      const nextToken = data?.token || null
      if (nextToken) {
        setSessionToken(nextToken)
        try {
          const userResponse = await fetch(buildUrl('/api/user'), {
            headers: {
              Authorization: `Bearer ${nextToken}`,
              Accept: 'application/json',
            },
          })
          const userPayload = await userResponse.json()
          const nextUser = userPayload?.data ?? null
          if (!userResponse.ok) throw new Error('No se pudo cargar el usuario')
          if (nextUser?.status === 'n') {
            setSessionToken(null)
            setUser(null)
            throw new Error('Tu cuenta está desactivada')
          }
          setUser(nextUser)
        } catch (error) {
          if (error?.message === 'Tu cuenta está desactivada') {
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
      const response = await fetch(buildUrl('/api/register'), {
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
      const data = await response.json()
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
      await fetch(buildUrl('/api/logout'), {
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
    isLoading,
    login,
    register,
    logout,
  }

  // Proveedor del contexto que envuelve la app
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook para consumir el contexto de auth
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
