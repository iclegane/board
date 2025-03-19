import { api } from '@/api/axios.ts'
import { ACCESS_TOKEN_KEY, API_PATH } from '@/constants'

type ApiPayload = {
  payload: string
}

class Auth {
  constructor() {}

  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }

  async login(login: string, password: string) {
    try {
      const response = await api.post<ApiPayload>(API_PATH.LOGIN, {
        login,
        password,
      })

      const token = response.data.payload
      localStorage.setItem(ACCESS_TOKEN_KEY, token)
    } catch (error) {
      throw error
    }
  }

  async logout() {
    try {
      await api.post(API_PATH.LOGOUT)
    } catch (error) {
      throw error
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    }
  }

  async refresh(): Promise<string | undefined> {
    try {
      const response = await api.post<ApiPayload>(
        API_PATH.REFRESH,
        {},
        { withCredentials: true }
      )

      const token = response.data.payload
      localStorage.setItem(ACCESS_TOKEN_KEY, token)

      return token
    } catch (error) {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      throw error
    }
  }
}

export const AuthService = new Auth()
