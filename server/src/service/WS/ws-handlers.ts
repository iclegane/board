import { Position } from './types.js'
import { SystemLogger } from '../../logger/index.js'
import { Card } from '../../models/Cards.js'

export class WSMessageHandler {
  static handleCardPosition = async (id: string, position: Position) => {
    try {
      const card = await Card.findOne({ _id: id })
      if (!card) {
        SystemLogger.warning(`Card with id ${id} not found`)
        return
      }

      card.set({ x: position.x, y: position.y })
      await card.save()
    } catch (error) {
      SystemLogger.error('Error saving card position')
    }
  }
}
