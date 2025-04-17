import express from 'express'

import { CONFIG } from './config/index.js'
import { initMiddlewares, initProcessSignals, initMongo } from './init/index.js'
import { SystemLogger } from './logger/index.js'
import { authRouter, boardRouter } from './routes/index.js'
import { WSServer } from './service/index.js'

const app = express()

// --- Init external services ---
new WSServer(Number(CONFIG.WS_PORT))
await initMongo(CONFIG.MONGO_URI)

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
