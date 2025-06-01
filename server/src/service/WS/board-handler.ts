import { Position } from './types.js'
import { WSServer } from './WS.js'
import { SystemLogger } from '../../logger/index.js'
import { Card } from '../../models/Cards.js'

type CardPayload = {
  id: string
  login: string
  expiresIn: number
}

type CardData = {
  id: string
  position: Position
}

export class BoardHandler {
  constructor(private wsServer: WSServer) {
    this.registerHandlers()
  }

  private registerHandlers() {
    this.wsServer.on('move', this.handleCardMove.bind(this))
    this.wsServer.on('start', this.handleCardMoveStart.bind(this))
    this.wsServer.on('end', this.handleCardMoveEnd.bind(this))
    this.wsServer.on('cursor_move', this.handleCursorMove.bind(this))
  }

  private async handleCardMove(payload: CardPayload, data: CardData) {
    this.wsServer.broadcast(payload.id, 'move', {
      ...data,
      from: payload,
    })
  }

  private async handleCardMoveStart(payload: CardPayload, data: CardData) {
    this.wsServer.broadcast(payload.id, 'start', {
      ...data,
      from: payload,
    })
  }

  private async handleCardMoveEnd(payload: CardPayload, data: CardData) {
    this.wsServer.broadcast(payload.id, 'end', {
      ...data,
      from: payload,
    })

    try {
      const card = await Card.findOne({ _id: data.id })
      if (!card) {
        SystemLogger.warning(`Card with id ${data.id} not found`)
        return
      }

      card.set({ x: data.position.x, y: data.position.y })

      await card.save()
    } catch (error) {
      SystemLogger.error('Error saving card position')
    }
  }

  private async handleCursorMove(payload: CardPayload, data: CardData) {
    this.wsServer.broadcast(payload.id, 'cursor_move', {
      ...data,
      from: payload,
    })
  }
}
