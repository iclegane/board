import process from 'process'

import logger from '../logger/index.js'

export const initProcessSignals = () => {
  process.on('SIGTERM', () => {
    logger.info('🛑 Закрываем сервер...')
    process.exit(0)
  })

  process.on('SIGINT', () => {
    logger.info('🛑 Принудительное завершение...')
    process.exit(0)
  })
}
