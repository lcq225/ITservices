import rateLimit from 'express-rate-limit'
import { Response } from 'express'
import { ApiResponse } from '../types'

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: '登录尝试次数过多，请15分钟后再试'
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false
})

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: '请求过于频繁，请稍后再试'
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false
})

export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: '上传请求过于频繁，请稍后再试'
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false
})
