import bcrypt from 'bcrypt'
import { Router } from 'express'

import { HTTP_STATUS } from '../constants/HttpStatus.js'
import { SuccessResponse, ErrorResponse } from '../dto/ResponseDTO.js'
import { validate } from '../middleware/validateMiddleware.js'
import { User } from '../models/User.js'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/token.js'
import { registerSchema, loginSchema } from '../validations/authValidation.js'

const router = Router()

router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { login, password } = req.body
    const user = await User.findOne({ login })
    if (!user) {
      const response = new ErrorResponse('Invalid credentials')
      res.status(HTTP_STATUS.BAD_REQUEST).json(response)
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      const response = new ErrorResponse('Invalid credentials')
      res.status(HTTP_STATUS.BAD_REQUEST).json(response)
      return
    }

    const accessToken = generateAccessToken(user.id, login)
    const refreshToken = generateRefreshToken(user.id, login)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    })

    res.setHeader('Authorization', `Bearer ${accessToken}`)

    const response = new SuccessResponse(accessToken)
    res.status(HTTP_STATUS.OK).json(response)
  } catch {
    const response = new ErrorResponse('Server error')
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response)
  }
})

router.post('/create', validate(registerSchema), async (req, res) => {
  try {
    const { login, password } = req.body

    const existingUser = await User.findOne({ login })
    if (existingUser) {
      const response = new ErrorResponse('Login already exist')
      res.status(HTTP_STATUS.BAD_REQUEST).json(response)
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ login, password: hashedPassword })
    const user = await newUser.save()

    const response = new SuccessResponse({
      id: user.id,
    })
    res.status(HTTP_STATUS.OK).json(response)
  } catch {
    const response = new ErrorResponse('Server error')
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response)
  }
})

router.post('/logout', async (_req, res) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    })

    const response = new SuccessResponse()
    res.status(HTTP_STATUS.OK).json(response)
  } catch {
    const response = new ErrorResponse('Server error')
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response)
  }
})

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      const response = new ErrorResponse('Unauthorized')
      res.status(HTTP_STATUS.UNAUTHORIZED).json(response)
      return
    }

    const payload = verifyRefreshToken(refreshToken)

    if (!payload) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      })
      const response = new ErrorResponse('Unauthorized')
      res.status(HTTP_STATUS.UNAUTHORIZED).json(response)
      return
    }

    const accessToken = generateAccessToken(payload.id, payload.login)

    res.setHeader('Authorization', `Bearer ${accessToken}`)

    const response = new SuccessResponse(accessToken)
    res.status(HTTP_STATUS.OK).json(response)
  } catch {
    const response = new ErrorResponse('Server error')
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response)
  }
})

export default router
