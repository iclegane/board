import process from 'process'

import { SystemLogger } from '../logger/index.js'

export const initProcessSignals = () => {
  process.on('SIGTERM', () => {
    SystemLogger.info('🛑 Закрываем сервер...')
    process.exit(0)
  })

  process.on('SIGINT', () => {
    SystemLogger.info('🛑 Принудительное завершение...')
    process.exit(0)
  })
}
