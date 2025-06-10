import { WebSocket } from 'ws'

import type { Payload } from '../../utils/token.js'

export type ClientInfo = {
  socket: WebSocket
  userId: string
}

export type Position = {
  x: number
  y: number
}

export type ResponseMessage = {
  from: Payload
  data: { [key: string]: unknown }
}

export type RequestMessage = {
  type: string
  data: { [key: string]: unknown }
}
