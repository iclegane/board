import mongoose from 'mongoose'

import { SystemLogger } from '../logger/index.js'

export const initMongo = async (url: string) => {
  try {
    await mongoose.connect(url)

    SystemLogger.info(`🚀 [MongoDB] Connection established`)
  } catch (error) {
    SystemLogger.error(`🛑 [MongoDB] Connection failed`)
    throw error
  }
}
