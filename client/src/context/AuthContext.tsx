import React, {
  createContext,
  useCallback,
  useContext,
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
  accessToken: string | null
  login: (login: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

type LoginPayload = {
  payload: {
    accessToken: string
  }
}

export const AuthProvider: React.FC<AuthProvider> = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(ACCESS_TOKEN_KEY)
  )

  const isLogged = Boolean(accessToken)

  const login = useCallback(async (login: string, password: string) => {
    try {
      const response = await api.post<LoginPayload>(API_PATH.LOGIN, {
        login,
        password,
      })
      const token = response.data.payload.accessToken
      setAccessToken(token)
      localStorage.setItem(ACCESS_TOKEN_KEY, token)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post(API_PATH.LOGOUT)
    } finally {
      setAccessToken(null)
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    }
  }, [])

  const value = useMemo(
    () => ({ accessToken, login, logout, isLogged }),
    [accessToken]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const auth = useContext(AuthContext)
  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return auth
}
