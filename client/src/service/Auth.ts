import { api } from '@/api/axios.ts'
import { ACCESS_TOKEN_KEY, API_PATH } from '@/constants'
import { WebSocketService } from '@/service/WebSocket.ts'

type UserData = {
  id: string
  login: string
}

type LoginResponse = UserData & {
  accessToken: string
}

type ApiPayload<T> = {
  payload: T
}

// Todo: Вынести сохранения/запись ls в отдельные сервис
class Auth {
  constructor() {}

  getToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }

  login = async (login: string, password: string): Promise<UserData> => {
    try {
      const response = await api.post<ApiPayload<LoginResponse>>(
        API_PATH.LOGIN,
        {
          login,
          password,
        }
      )

      const { accessToken, ...props } = response.data.payload
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)

      return props
    } catch (error) {
      throw error
    } finally {
      WebSocketService.reconnectManually()
    }
  }

  logout = async () => {
    try {
      await api.post(API_PATH.LOGOUT)
    } catch (error) {
      throw error
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      WebSocketService.stop()
    }
  }

  refresh = async (): Promise<string | undefined> => {
    try {
      const response = await api.post<ApiPayload<LoginResponse>>(
        API_PATH.REFRESH,
        {},
        { withCredentials: true }
      )

      const { accessToken } = response.data.payload
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)

      return accessToken
    } catch (error) {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      throw error
    } finally {
      WebSocketService.reconnectManually()
    }
  }

  check = async (): Promise<UserData> => {
    try {
      const response = await api.post<ApiPayload<UserData>>(API_PATH.CHECK)
      return response.data.payload
    } catch (error) {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      throw error
    }
  }
}

export const AuthService = new Auth()
