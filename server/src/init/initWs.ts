import { WSServer } from '../service/WS.js'

export function initWS(port: number) {
  return new WSServer(port)
}
