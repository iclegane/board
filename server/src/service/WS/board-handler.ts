import { Position } from './types.js'
import { WSServer } from './WS.js'
import { WS_TYPES } from '../../constants/WS.js'
import { SystemLogger } from '../../logger/index.js'
import { Card } from '../../models/Cards.js'
import { Payload } from '../../utils/token.js'

type CardData = {
  id: string
  position: Position
}

type AddCardProps = {
  name: string
  position: Position
}

export class BoardHandler {
  constructor(private wsServer: WSServer) {
    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    const eventHandlers = {
      [WS_TYPES.CARD.DRAG.START]: this.handleCardDragStarted,
      [WS_TYPES.CARD.DRAG.MOVE]: this.handleCardMoved,
      [WS_TYPES.CARD.DRAG.END]: this.handleCardDragEnded,
      [WS_TYPES.CURSOR.MOVE]: this.handleCursorMoved,
      [WS_TYPES.CARD.CREATE]: this.handleCardCreated,
      [WS_TYPES.CARD.DELETE]: this.handleCardDeleted,
    }

    Object.entries(eventHandlers).forEach(([eventType, eventHandler]) => {
      this.wsServer.on(eventType, eventHandler.bind(this))
    })
  }

  private handleCardDragStarted = (payload: Payload, data: CardData) => {
    this.wsServer.broadcast(payload.id, WS_TYPES.CARD.DRAG.STARTED, {
      data,
      from: payload,
    })
  }

  private handleCardMoved = (payload: Payload, data: CardData) => {
    this.wsServer.broadcast(payload.id, WS_TYPES.CARD.DRAG.MOVED, {
      data,
      from: payload,
    })
  }

  private handleCardDragEnded = async (payload: Payload, data: CardData) => {
    try {
      const card = await Card.findOne({ _id: data.id })
      if (!card) {
        SystemLogger.warning(`Card with id ${data.id} not found`)
        return
      }

      card.set({ x: data.position.x, y: data.position.y })
      await card.save()

      this.wsServer.broadcast(payload.id, WS_TYPES.CARD.DRAG.ENDED, {
        data,
        from: payload,
      })
    } catch {
      SystemLogger.error('Error saving card position')
    }
  }

  private handleCursorMoved = (payload: Payload, data: CardData) => {
    this.wsServer.broadcast(payload.id, WS_TYPES.CURSOR.MOVED, {
      from: payload,
      data,
    })
  }

  private handleCardCreated = async (
    payload: Payload,
    cardDetails: AddCardProps
  ) => {
    try {
      const { position, name } = cardDetails

      const newCard = await Card.create({
        name,
        ...position,
        userId: payload.id,
      })

      this.wsServer.broadcast(
        payload.id,
        WS_TYPES.CARD.CREATED,
        {
          data: {
            id: newCard.id,
            name: newCard.name,
            x: newCard.x,
            y: newCard.y,
          },
          from: payload,
        },
        true
      )
    } catch {
      SystemLogger.error('Error create card')
    }
  }

  private handleCardDeleted = async (
    payload: Payload,
    data: Pick<CardData, 'id'>
  ) => {
    try {
      const result = await Card.deleteOne({ id: data.id, userId: payload.id })

      if (result.deletedCount === 0) {
        throw new Error(
          'The card was not found or you do not have the rights to delete it'
        )
      }

      this.wsServer.broadcast(
        payload.id,
        WS_TYPES.CARD.DELETED,
        {
          data,
          from: payload,
        },
        true
      )
    } catch {
      SystemLogger.error('Error delete card')
    }
  }
}
