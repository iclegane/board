import crypto from 'crypto'
import dayjs from 'dayjs'
import process from 'process'

export type Payload = {
  id: string
  login: string
  expiresIn: number
}

const encrypt = (data: Payload, secretKey: string): string => {
  const IV = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(secretKey, 'hex'),
    IV
  )
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return Buffer.from(`${IV.toString('hex')}:${encrypted}`).toString('base64')
}

const decrypt = (token: string, secretKey: string): Payload | null => {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8')
    const [ivHex, encryptedData] = raw.split(':')
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(secretKey, 'hex'),
      Buffer.from(ivHex, 'hex')
    )
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return JSON.parse(decrypted)
  } catch {
    return null
  }
}

export const generateAccessToken = (userId: string, login: string): string => {
  return encrypt(
    { id: userId, login, expiresIn: dayjs().add(5, 'minute').unix() },
    process.env.JWT_ACCESS_SECRET_KEY!
  )
}

export const generateRefreshToken = (userId: string, login: string): string => {
  return encrypt(
    { id: userId, login, expiresIn: dayjs().add(3, 'hour').unix() },
    process.env.JWT_REFRESH_SECRET_KEY!
  )
}

export const verifyAccessToken = (token: string): Payload | null => {
  const data = decrypt(token, process.env.JWT_ACCESS_SECRET_KEY!)

  if (data !== null && dayjs().isBefore(dayjs.unix(data.expiresIn))) {
    return data
  }

  return null
}

export const verifyRefreshToken = (token: string): Payload | null => {
  const data = decrypt(token, process.env.JWT_REFRESH_SECRET_KEY!)

  if (data !== null && dayjs().isBefore(dayjs.unix(data.expiresIn))) {
    return data
  }

  return null
}
