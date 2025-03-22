import { WebSocketServer, WebSocket } from 'ws'

import { Card } from '../models/Cards.js'
import { verifyAccessToken, type Payload } from '../utils/token.js'

type ClientInfo = {
  socket: WebSocket
  userId: string
}

type Position = {
  x: number
  y: number
}

type Message = {
  id: string
  type: 'start' | 'move' | 'end'
  position: Position
}

type ResponseMessage = {
  from: Payload
} & Message

// https://ably.com/blog/websocket-authentication
export class WSServer {
  private wss: WebSocketServer
  private clients: ClientInfo[] = []

  constructor(port: number) {
    this.wss = new WebSocketServer({ port })
    console.log(`WebSocket server started on port ${port}`)

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
    console.log(`WebSocket client connected: ${userId}`)

    const clientInfo: ClientInfo = { userId, socket: ws }
    this.clients.push(clientInfo)

    ws.on('message', (rawMsg) => {
      this.handleMessage(payload, rawMsg.toString())
    })

    ws.on('close', () => {
      this.removeClient(ws)
      console.log(`WebSocket client disconnected: ${userId}`)
    })
  }

  private removeClient = (socket: WebSocket) => {
    this.clients = this.clients.filter((c) => c.socket !== socket)
  }

  private handleMessage = async (payload: Payload, rawMessage: string) => {
    try {
      const data: Partial<Message> = JSON.parse(rawMessage)
      const { id, type, position } = data

      if (!id || !type || !position) {
        console.warn('Invalid message format:', data)
        return
      }

      const message = { from: payload, id, position, type }

      if (type === 'end') {
        this.saveCardPosition(id, position)
      }

      this.callChannels(payload.id, message)
    } catch (error) {
      console.error('Failed to handle message', error)
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

  private saveCardPosition = async (id: string, position: Position) => {
    try {
      const card = await Card.findOne({ id })
      if (!card) {
        console.warn(`Card with id ${id} not found`)
        return
      }

      card.set({ x: position.x, y: position.y })
      card.save()
    } catch (error) {
      console.error('Error saving card:', error)
    }
  }
}
