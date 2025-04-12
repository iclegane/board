import express from 'express'

import { CONFIG } from './config/index.js'
import {
  initMiddlewares,
  initProcessSignals,
  initMongo,
  initWS,
} from './init/index.js'
import { SystemLogger } from './logger/index.js'
import { authRouter, boardRouter } from './routes/index.js'

const app = express()

// --- Init external services ---
initWS(Number(CONFIG.WS_PORT))
initMongo(CONFIG.MONGO_URI)

// --- Middlewares ---
initMiddlewares(app)

// --- Graceful shutdown ---
initProcessSignals()

// --- Routes ---
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/board', boardRouter)

// --- Start server ---
app.listen(CONFIG.PORT, () => {
  SystemLogger.info(`🚀 Server running at http://localhost:${CONFIG.PORT}`)
})
