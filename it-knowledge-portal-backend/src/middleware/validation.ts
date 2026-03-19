import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { ApiResponse } from '../types'

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    res.status(400).json({
      success: false,
      error: '参数验证失败',
      data: errors.array()
    })
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  console.error('Error:', err)

  if (err.name === 'PrismaClientKnownRequestError') {
    res.status(400).json({
      success: false,
      error: '数据库操作失败'
    })
    return
  }

  res.status(500).json({
    success: false,
    error: '服务器内部错误'
  })
}
