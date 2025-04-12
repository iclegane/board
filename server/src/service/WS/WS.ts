import { WebSocketServer, WebSocket } from 'ws'

import { ClientInfo, Message, ResponseMessage } from './types.js'
import { WSMessageHandler } from './ws-handlers.js'
import { WSMessageValidator } from './ws-validators.js'
import { SystemLogger } from '../../logger/index.js'
import { verifyAccessToken, type Payload } from '../../utils/token.js'

// https://ably.com/blog/websocket-authentication
export class WSServer {
  private wss: WebSocketServer
  private clients: ClientInfo[] = []

  constructor(port: number) {
    this.wss = new WebSocketServer({ port })
    SystemLogger.info(`🚀 WebSocket server started on port ${port}`)

    this.init()
  }

  private init = () => {
    this.wss.on('connection', (ws: WebSocket) => {
      ws.once('message', (rawMessage) => {
        try {
          const data = JSON.parse(rawMessage.toString())
          if (data.type !== 'auth' || typeof data.token !== 'string') {
            ws.close(1008, 'Authentication Error')
            return
          }

          const payload = verifyAccessToken(data.token)
          if (!payload) {
            ws.close(1008, 'Authentication Error')
            return
          }

          this.addClient(ws, payload)
        } catch {
          ws.close(1003, 'Invalid init message')
        }
      })
    })
  }

  private addClient = (ws: WebSocket, payload: Payload) => {
    const { id: userId } = payload
    SystemLogger.info(`WebSocket client connected: ${userId}`)

    const clientInfo: ClientInfo = { userId, socket: ws }
    this.clients.push(clientInfo)

    ws.on('message', (rawMsg) => {
      this.handleMessage(payload, rawMsg.toString())
    })

    ws.on('close', () => {
      this.removeClient(ws)
      SystemLogger.info(`WebSocket client disconnected: ${userId}`)
    })
  }

  private removeClient = (socket: WebSocket) => {
    this.clients = this.clients.filter((c) => c.socket !== socket)
  }

  private handleMessage = async (payload: Payload, rawMessage: string) => {
    try {
      const data: Partial<Message> = JSON.parse(rawMessage)

      const baseMessage = await WSMessageValidator.validateBaseMessage(data)
      if (!baseMessage) return

      switch (baseMessage.type) {
        case 'end': {
          const endMessage = await WSMessageValidator.validateEndMessage(data)
          if (endMessage) {
            await WSMessageHandler.handleCardPosition(
              endMessage.id,
              endMessage.position
            )
          }
          break
        }
      }

      const { id, type, position } = baseMessage
      const message = { from: payload, id, position, type }

      this.callChannels(payload.id, message as ResponseMessage)
    } catch (error) {
      SystemLogger.error('Critical Failed to handle message')
    }
  }

  private callChannels = (senderId: string, message: ResponseMessage) => {
    const json = JSON.stringify(message)
    this.clients.forEach(({ userId, socket }) => {
      if (userId !== senderId && socket.readyState === WebSocket.OPEN) {
        socket.send(json)
      }
    })
  }
}
