export const API_BASE_URL = 'http://localhost:5001/api/v1/'
export const WS_URL = 'http://localhost:8080'

export const BEARER_PREFIX = 'Bearer'

export const API_PATH = {
  LOGIN: 'auth/login',
  CREATE: 'auth/create',
  LOGOUT: 'auth/logout',
  REFRESH: 'auth/refresh',
  CHECK: 'auth/check',
  CARD: '/board/card',
} as const

export const PAGES_PATH = {
  INDEX: '/',
  LOGIN: '/login',
  CREATE: '/create',
  LOGOUT: '/logout',
  BOARD: '/board',
} as const

export const ACCESS_TOKEN_KEY = 'accessToken'

export const WS_TYPES = {
  AUTH: {
    INIT: 'auth:init',
    REFRESH: 'auth:refresh',
  },
  CARD: {
    CREATED: 'card:created',
    CREATE: 'card:create',
    DRAG: {
      START: 'card:drag:start',
      STARTED: 'card:drag:started',
      MOVE: 'card:drag:move',
      MOVED: 'card:drag:moved',
      END: 'card:drag:end',
      ENDED: 'card:drag:ended',
    },
  },
  CURSOR: { MOVE: 'cursor:move', MOVED: 'cursor:moved' },
} as const
