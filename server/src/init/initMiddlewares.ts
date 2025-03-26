import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express } from 'express'
import morgan from 'morgan'

import { CONFIG } from '../config/index.js'
import logger from '../logger/index.js'

export const initMiddlewares = (app: Express) => {
  app.use(express.json())
  app.use(cookieParser())
  app.use(
    cors({
      origin: CONFIG.CLIENT_ORIGIN,
      credentials: true,
    })
  )

  app.use(
    morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  )
}
