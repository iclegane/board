import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { AuthService } from '@/service/Auth.ts'

type AuthProvider = {
  children: React.ReactNode
}

type AuthContextType = {
  isLogged: boolean
  login: (login: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<AuthProvider> = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false)

  const login = useCallback(async (login: string, password: string) => {
    try {
      await AuthService.login(login, password)
      setIsLogged(true)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await AuthService.logout()
    } finally {
      setIsLogged(false)
    }
  }, [])

  const value = useMemo(
    () => ({ login, logout, isLogged }),
    [login, logout, isLogged]
  )

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AuthService.refresh()

        setIsLogged(Boolean(token))
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
