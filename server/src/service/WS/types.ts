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

// Todo Сделать шаблонный тип для message
export type Message = {
  id?: string
  type: 'start' | 'move' | 'end'
  position: Position
}

export type ResponseMessage = {
  from: Payload
} & Message
