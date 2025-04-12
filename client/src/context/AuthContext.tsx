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
  login: (login: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<AuthProvider> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null)

  const login = useCallback(async (login: string, password: string) => {
    try {
      const user = await AuthService.login(login, password)
      setUser(user)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await AuthService.logout()
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ login, logout, isLogged: Boolean(user), user }),
    [login, logout, user]
  )

  // Todo: Подумать над лоудером
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AuthService.check()
        setUser(user)
      } catch {
        setUser(null)
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
