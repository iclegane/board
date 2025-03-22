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

let isRetried = false

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      error.config.url !== API_PATH.REFRESH &&
      !isRetried
    ) {
      try {
        const token = await AuthService.refresh()

        error.config.headers.Authorization = `${BEARER_PREFIX} ${token}`
        return api.request(error.config)
      } catch {
        return Promise.reject(error)
      } finally {
        isRetried = true
      }
    }
    return Promise.reject(error)
  }
)
