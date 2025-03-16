import axios from 'axios'

import { API_PATH, ACCESS_TOKEN_KEY } from '@/constants'

export const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await axios.post(
          API_PATH.REFRESH,
          {},
          { withCredentials: true }
        )
        const newAccessToken = refreshResponse.data.accessToken
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken)

        error.config.headers.Authorization = `Bearer ${newAccessToken}`
        return api.request(error.config)
      } catch (_e) {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
      }
    }
    return Promise.reject(error)
  }
)
