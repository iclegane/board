import { ACCESS_TOKEN_KEY, WS_URL } from '@/constants'

export type Message = { type: string; [key: string]: any }
type Callback = (message: Message) => void

class WS {
  private socket!: WebSocket
  private listeners: Set<Callback> = new Set()
  private messageQueue: string[] = []

  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isManuallyClosed = false

  private hasAuthError = false

  constructor() {
    this.connect()
  }

  private connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return
    if (this.hasAuthError) return

    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    this.socket = new WebSocket(WS_URL)

    this.socket.onopen = () => {
      this.reconnectAttempts = 0
      this.send({ type: 'auth', token })
      this.flushQueue()
    }

    this.socket.onmessage = (event) => {
      try {
        const data: Message = JSON.parse(event.data)
        this.listeners.forEach((cb) => cb(data))
      } catch {
        console.error('Invalid JSON:', event.data)
      }
    }

    this.socket.onclose = (event) => {
      if (event.code === 1008) {
        console.warn('WebSocket closed due to authentication error')
        this.hasAuthError = true
        return
      }

      if (
        !this.isManuallyClosed ||
        !this.hasAuthError ||
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        setTimeout(() => {
          this.reconnectAttempts++
          this.connect()
        }, this.reconnectDelay)
      }
    }
  }

  private flushQueue = () => {
    while (this.messageQueue.length && this.isReady()) {
      this.socket?.send(this.messageQueue.shift()!)
    }
  }

  private isReady(): boolean {
    return this.socket.readyState === WebSocket.OPEN
  }

  private clear = () => {
    this.reconnectAttempts = 0
    this.hasAuthError = false
    this.isManuallyClosed = true
  }

  public send = (message: Message) => {
    const str = JSON.stringify(message)
    if (this.isReady()) {
      this.socket?.send(str)
    } else {
      this.messageQueue.push(str)
    }
  }

  public reconnectManually = () => {
    this.clear()
    this.connect()
  }

  public onMessage = (callback: Callback) => {
    this.listeners.add(callback)
  }

  public offMessage = (callback: Callback) => {
    this.listeners.delete(callback)
  }

  public stop = () => {
    this.clear()
    this.socket.close()
  }
}

export const WebSocketService = new WS()
