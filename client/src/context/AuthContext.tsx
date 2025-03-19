import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

import { api } from '@/api/axios'
import { ACCESS_TOKEN_KEY, API_PATH } from '@/constants'

type AuthProvider = {
  children: React.ReactNode
}

type AuthContextType = {
  isLogged: boolean
  login: (login: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

type LoginPayload = {
  payload: {
    accessToken: string
  }
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<AuthProvider> = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false)

  const login = useCallback(async (login: string, password: string) => {
    try {
      const response = await api.post<LoginPayload>(API_PATH.LOGIN, {
        login,
        password,
      })
      const token = response.data.payload.accessToken
      localStorage.setItem(ACCESS_TOKEN_KEY, token)
      setIsLogged(true)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post(API_PATH.LOGOUT)
    } finally {
      setIsLogged(false)
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    }
  }, [])

  const value = useMemo(
    () => ({ login, logout, isLogged }),
    [login, logout, isLogged]
  )

  useLayoutEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.post(
          API_PATH.REFRESH,
          {},
          { withCredentials: true }
        )
        setIsLogged(Boolean(response.data.payload))
      } catch {
        setIsLogged(false)
      }
    }

    checkAuth()
  }, [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const auth = useContext(AuthContext)
  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return auth
}
