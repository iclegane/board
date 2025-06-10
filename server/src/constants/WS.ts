export const WS_TYPES = {
  ERROR: 'error',

  CARD: {
    CREATE: 'card:create',
    CREATED: 'card:created',
    DELETE: 'card:delete',
    DELETED: 'card:deleted',
    DRAG: {
      START: 'card:drag:start',
      STARTED: 'card:drag:started',
      MOVE: 'card:drag:move',
      MOVED: 'card:drag:moved',
      END: 'card:drag:end',
      ENDED: 'card:drag:ended',
    },
  },
  CURSOR: {
    MOVE: 'cursor:move',
    MOVED: 'cursor:moved',
  },
  AUTH: {
    INIT: 'auth:init',
    REFRESH: 'auth:refresh',
  },
} as const
