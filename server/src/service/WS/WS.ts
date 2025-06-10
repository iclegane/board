import { WebSocketServer, WebSocket } from 'ws'

import { ClientInfo, RequestMessage, ResponseMessage } from './types.js'
import { WS_TYPES } from '../../constants/WS.js'
import { SystemLogger } from '../../logger/index.js'
import { verifyAccessToken, type Payload } from '../../utils/token.js'

type PayloadWithToken = Payload & {
  token: string
}
type MessageHandler<T, U> = (payload: T, message: U) => Promise<void> | void

// https://ably.com/blog/websocket-authentication
export class WSServer {
  private wss: WebSocketServer
  private clients: ClientInfo[] = []
  private handlers: Map<string, MessageHandler<any, any>> = new Map()

  constructor(port: number) {
    this.wss = new WebSocketServer({ port })
    this.init()
    SystemLogger.info(`🚀 WebSocket server started on port ${port}`)
  }

  public on = <T, U>(type: string, handler: MessageHandler<T, U>) => {
    this.handlers.set(type, handler)
  }

  public send = (
    userId: string,
    type: string,
    data: ResponseMessage['data']
  ) => {
    const client = this.clients.find((c) => c.userId === userId)

    if (client?.socket.readyState !== WebSocket.OPEN) {
      return
    }

    try {
      client.socket.send(JSON.stringify({ type, data }))
    } catch (error) {
      SystemLogger.error(`Error sending message to user ${userId}:`, error)
      this.removeClient(client.socket)
    }
  }

  public broadcast = (
    excludeUserId: string,
    type: string,
    data: ResponseMessage,
    sendAll = false
  ) => {
    this.clients.forEach((client) => {
      if (
        (client.userId !== excludeUserId || sendAll) &&
        client.socket.readyState === WebSocket.OPEN
      ) {
        try {
          client.socket.send(JSON.stringify({ type, ...data }))
        } catch (error) {
          SystemLogger.error(
            `Error broadcasting to user ${client.userId}:`,
            error
          )
          this.removeClient(client.socket)
        }
      }
    })
  }

  private init = () => {
    this.wss.on('connection', (ws: WebSocket) => {
      ws.once('message', (rawMessage) => {
        try {
          const {
            type,
            data: { token },
          } = JSON.parse(rawMessage.toString()) as RequestMessage
          if (type !== WS_TYPES.AUTH.INIT || typeof token !== 'string') {
            ws.close(1008, 'Authentication Error')
            return
          }

          const payload = verifyAccessToken(token)
          if (!payload) {
            ws.close(1008, 'Authentication Error')
            return
          }

          this.addClient(ws, { ...payload, token })
        } catch (error) {
          SystemLogger.warn('Authentication failed:', error)
          ws.close(1003, 'Invalid init message')
        }
      })

      ws.on('error', (error) => {
        SystemLogger.error('WebSocket error:', error)
        ws.close(1006, 'Internal error')
      })
    })

    this.wss.on('error', (error) => {
      SystemLogger.error('WebSocket server error:', error)
    })
  }

  private addClient = (ws: WebSocket, payload: PayloadWithToken) => {
    const { id: userId, token } = payload
    SystemLogger.info(`WebSocket client connected: ${userId}`)

    const clientInfo: ClientInfo = { userId, socket: ws }
    this.clients.push(clientInfo)

    ws.on('message', (rawMsg) => {
      const verify = verifyAccessToken(token)
      if (!verify) {
        this.send(userId, WS_TYPES.AUTH.REFRESH, {})
        ws.close(1008, 'Authentication Error')
        return
      }

      this.handleMessage(payload, rawMsg.toString())
    })

    ws.on('close', () => {
      this.removeClient(ws)
      SystemLogger.info(`WebSocket client disconnected: ${userId}`)
    })

    ws.on('error', (error) => {
      SystemLogger.error(`WebSocket error for user ${userId}:`, error)
      this.removeClient(ws)
    })
  }

  private removeClient = (socket: WebSocket) => {
    this.clients = this.clients.filter((c) => c.socket !== socket)
  }

  private handleMessage = (payload: Payload, rawMessage: string) => {
    try {
      const { type, data } = JSON.parse(rawMessage) as RequestMessage
      const handler = this.handlers.get(type)

      if (!handler) {
        SystemLogger.warn(`No handler for message type: ${type}`)
        return
      }

      try {
        const result = handler(payload, data)

        if (result instanceof Promise) {
          result.catch((error) => {
            SystemLogger.error(`Async handler error for "${type}":`, error)
          })
        }
      } catch (error) {
        SystemLogger.error(`Handler error for "${type}":`, error)
      }
    } catch (error) {
      SystemLogger.error('Message handling error:', error)
    }
  }
}
