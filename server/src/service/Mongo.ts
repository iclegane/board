import mongoose from 'mongoose'

import logger from '../logger/index.js'

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

      logger.info(`🚀 [MongoDB] Connection established`)
    } catch (error) {
      logger.error(`🛑 [MongoDB] Connection failed:`, error)
      throw error
    }
  }
}
