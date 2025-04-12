import mongoose from 'mongoose'

import { SystemLogger } from '../logger/index.js'

export class Mongo {
  constructor(url?: string) {
    if (!url) {
      throw new Error('MongoDB URI is missing')
    }

    this.connect(url)
  }

  private connect = async (url: string) => {
    try {
      await mongoose.connect(url)

      SystemLogger.info(`🚀 [MongoDB] Connection established`)
    } catch (error) {
      SystemLogger.error(`🛑 [MongoDB] Connection failed`)
      throw error
    }
  }
}
