import axios from 'axios'

import { API_PATH, API_BASE_URL, BEARER_PREFIX } from '@/constants'
import { AuthService } from '@/service/Auth.ts'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = AuthService.getToken()
  if (token) {
    config.headers.Authorization = `${BEARER_PREFIX} ${token}`
  }
  return config
})

let refreshTokenPromise: null | Promise<string | undefined> = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestUrl = error.config.url

    if (
      error.response?.status === 401 &&
      requestUrl !== API_PATH.REFRESH &&
      requestUrl !== API_PATH.CHECK
    ) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = AuthService.refresh().finally(() => {
          refreshTokenPromise = null
        })
      }

      try {
        const updatedToken = await refreshTokenPromise
        error.config.headers.Authorization = `${BEARER_PREFIX} ${updatedToken}`
        return api.request(error.config)
      } catch {
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)
