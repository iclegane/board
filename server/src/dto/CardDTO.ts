import { type CardType } from '../models/Cards.js'

export class CardDTO {
  readonly id: string
  readonly name: string
  readonly coordinates: { x: number; y: number }

  constructor(card: CardType) {
    this.id = card._id
    this.name = card.name
    this.coordinates = {
      x: card.x,
      y: card.y,
    }
  }
}
