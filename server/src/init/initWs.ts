import { WSServer } from '../service/index.js'

export function initWS(port: number) {
  return new WSServer(port)
}
