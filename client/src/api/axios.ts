import axios from 'axios'

import {
  API_PATH,
  ACCESS_TOKEN_KEY,
  API_BASE_URL,
  BEARER_PREFIX,
} from '@/constants'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `${BEARER_PREFIX} ${token}`
  }
  return config
})

let isRetried = false
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !isRetried) {
      try {
        const response = await api.post(
          API_PATH.REFRESH,
          {},
          { withCredentials: true }
        )
        const newAccessToken = response.data.payload
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken)

        error.config.headers.Authorization = `${BEARER_PREFIX} ${newAccessToken}`
        return api.request(error.config)
      } catch {
        isRetried = true
        localStorage.removeItem(ACCESS_TOKEN_KEY)
      }
    }
    return Promise.reject(error)
  }
)
