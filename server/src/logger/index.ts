import fs from 'fs'
import path from 'path'
import { createLogger, format, transports } from 'winston'

const logDir = 'logs'
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.colorize(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
})

export default logger
