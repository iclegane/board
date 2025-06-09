import { baseMessageSchema, endMessageSchema } from './ws-schemas.js'
import { SystemLogger } from '../../logger/index.js'

export class WSMessageValidator {
  /**
   * Проверяет, что сообщение соответствует базовой структуре
   */
  static validateBaseMessage = async (data: unknown) => {
    try {
      return await baseMessageSchema.validate(data, { stripUnknown: true })
    } catch {
      SystemLogger.error('Invalid message format')
      return null
    }
  }

  /**
   * Проверяет, что сообщение соответствует типу 'end'
   */
  static validateEndMessage = async (data: unknown) => {
    try {
      return await endMessageSchema.validate(data, { stripUnknown: true })
    } catch {
      SystemLogger.error('Invalid "end" message')
      return null
    }
  }
}
