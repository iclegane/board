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

type UserData = {
  id: string
  login: string
}

type AuthContextType = {
  user: UserData | null
  isLogged: boolean
  login: (login: string, password: string) => Promise<LoginResponse>
  logout: () => Promise<void>
  isCheckAuthLoading: boolean
}

type LoginResponse = {
  success: boolean
  error?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<AuthProvider> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [isCheckAuthLoading, setCheckAuthLoading] = useState(false)

  const login = useCallback(
    async (login: string, password: string): Promise<LoginResponse> => {
      try {
        const user = await AuthService.login(login, password)
        setUser(user)

        return { success: true }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed'
        return { success: false, error: message }
      }
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      await AuthService.logout()
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      login,
      logout,
      isLogged: Boolean(user),
      user,
      isCheckAuthLoading,
    }),
    [login, logout, user, isCheckAuthLoading]
  )

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setCheckAuthLoading(true)
        const user = await AuthService.check()
        setUser(user)
      } catch {
        setUser(null)
      } finally {
        setCheckAuthLoading(false)
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
