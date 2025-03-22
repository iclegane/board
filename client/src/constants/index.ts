export const API_BASE_URL = 'http://localhost:5000/api/v1/'
export const WS_URL = 'http://localhost:8080'

export const BEARER_PREFIX = 'Bearer'

export const API_PATH = {
  LOGIN: 'auth/login',
  CREATE: 'auth/create',
  LOGOUT: 'auth/logout',
  REFRESH: 'auth/refresh',
  CARD: '/board/card',
} as const

export const PAGES_PATH = {
  LOGIN: '/login',
  CREATE: '/create',
  LOGOUT: '/logout',
  BOARD: '/board',
} as const

export const ACCESS_TOKEN_KEY = 'accessToken'
