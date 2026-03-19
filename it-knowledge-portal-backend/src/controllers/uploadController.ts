import { Response } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { PrismaClient } from '@prisma/client'
import { ApiResponse, AuthRequest } from '../types'
import { config } from '../config'

const prisma = new PrismaClient()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = config.upload.dir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `${uuidv4()}${ext}`
    cb(null, filename)
  }
})

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('不支持的文件类型'))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSize
  }
})

export const uploadAttachment = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { articleId } = req.body
    const file = req.file

    if (!file) {
      res.status(400).json({ success: false, error: '未上传文件' })
      return
    }

    const attachment = await prisma.attachment.create({
      data: {
        fileName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        fileType: file.mimetype,
        articleId: articleId ? parseInt(articleId, 10) : undefined,
        uploaderId: userId
      }
    })

    res.json({ success: true, data: attachment })
  } catch (error) {
    console.error('UploadAttachment error:', error)
    res.status(500).json({ success: false, error: '上传文件失败' })
  }
}

export const deleteAttachment = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params

    const attachment = await prisma.attachment.findUnique({
      where: { id: parseInt(id, 10) }
    })

    if (!attachment) {
      res.status(404).json({ success: false, error: '附件不存在' })
      return
    }

    if (fs.existsSync(attachment.filePath)) {
      fs.unlinkSync(attachment.filePath)
    }

    await prisma.attachment.delete({
      where: { id: parseInt(id, 10) }
    })

    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('DeleteAttachment error:', error)
    res.status(500).json({ success: false, error: '删除附件失败' })
  }
}
