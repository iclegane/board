import dotenv from 'dotenv'
import process from 'process'

dotenv.config()

// Todo: Добавить валидацию или разделить на prod\dev env
export const CONFIG = {
  PORT: process.env.APP_PORT!,
  WS_PORT: process.env.WS_PORT!,
  MONGO_URI: process.env.MONGO_URI!,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN!,
} as const
