// TODO: Подумать
export class SuccessResponse<T = unknown> {
  readonly status = 'success'
  readonly payload?: T

  constructor(payload?: T) {
    this.payload = payload
  }
}

export class ErrorResponse<T = null> {
  readonly status = 'error'
  readonly message: string
  readonly payload?: T

  constructor(message: string, payload?: T) {
    this.message = message
    this.payload = payload
  }
}
