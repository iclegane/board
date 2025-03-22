import mongoose, { InferSchemaType } from 'mongoose'

const cardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export type CardType = InferSchemaType<typeof cardSchema>
export const Card = mongoose.model('Card', cardSchema)
