import { Mongo } from '../service/index.js'

export function initMongo(url: string) {
  return new Mongo(url)
}
