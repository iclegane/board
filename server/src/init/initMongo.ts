import { Mongo } from '../service/Mongo.js'

export function initMongo(url: string) {
  return new Mongo(url)
}
