import express from 'express'

import { CONFIG } from './config/index.js'
import {
  initMiddlewares,
  initProcessSignals,
  initMongo,
  initWS,
} from './init/index.js'
import logger from './logger/index.js'
import Auth from './routes/Auth.js'
import Board from './routes/Board.js'

const app = express()

// --- Init external services ---
initWS(Number(CONFIG.WS_PORT))
initMongo(CONFIG.MONGO_URI)

// --- Middlewares ---
initMiddlewares(app)

// --- Graceful shutdown ---
initProcessSignals()

// --- Routes ---
app.use('/api/v1/auth', Auth)
app.use('/api/v1/board', Board)

// --- Start server ---
app.listen(CONFIG.PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${CONFIG.PORT}`)
})
