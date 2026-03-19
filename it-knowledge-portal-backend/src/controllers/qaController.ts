import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { ApiResponse, AuthRequest, CreateQuestionDto, PaginatedResponse } from '../types'
import { QuestionWithDetails } from '../types'

const prisma = new PrismaClient()

export const getQuestions = async (
  req: AuthRequest,
  res: Response<ApiResponse<PaginatedResponse<QuestionWithDetails>>>
): Promise<void> => {
  try {
    const { tag, keyword, hasAcceptedAnswer, page = '1', pageSize = '10' } = req.query
    const pageNum = parseInt(page as string, 10)
    const pageSizeNum = parseInt(pageSize as string, 10)
    const skip = (pageNum - 1) * pageSizeNum

    const where: any = {}
    if (keyword) {
      where.OR = [
        { title: { contains: keyword as string, mode: 'insensitive' } },
        { content: { contains: keyword as string, mode: 'insensitive' } }
      ]
    }
    if (tag) where.tags = { has: tag as string }
    if (hasAcceptedAnswer === 'true') where.hasAcceptedAnswer = true

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: pageSizeNum,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, nickname: true, avatar: true }
          }
        }
      }),
      prisma.question.count({ where })
    ])

    res.json({
      success: true,
      data: {
        list: questions,
        total,
        page: pageNum,
        pageSize: pageSizeNum
      }
    })
  } catch (error) {
    console.error('GetQuestions error:', error)
    res.status(500).json({ success: false, error: '获取问题列表失败' })
  }
}

export const getQuestionById = async (
  req: AuthRequest,
  res: Response<ApiResponse<QuestionWithDetails>>
): Promise<void> => {
  try {
    const { id } = req.params

    const question = await prisma.question.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        author: {
          select: { id: true, nickname: true, avatar: true }
        },
        answers: {
          include: {
            author: {
              select: { id: true, nickname: true, avatar: true, role: true }
            }
          },
          orderBy: [
            { isAccepted: 'desc' },
            { likes: 'desc' },
            { createdAt: 'asc' }
          ]
        }
      }
    })

    if (!question) {
      res.status(404).json({ success: false, error: '问题不存在' })
      return
    }

    await prisma.question.update({
      where: { id: parseInt(id, 10) },
      data: { views: { increment: 1 } }
    })

    res.json({ success: true, data: question })
  } catch (error) {
    console.error('GetQuestionById error:', error)
    res.status(500).json({ success: false, error: '获取问题详情失败' })
  }
}

export const createQuestion = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const data: CreateQuestionDto = req.body

    const question = await prisma.question.create({
      data: {
        title: data.title,
        content: data.content,
        tags: data.tags,
        systemId: data.systemId,
        authorId: userId
      },
      include: {
        author: {
          select: { id: true, nickname: true, avatar: true }
        }
      }
    })

    res.json({ success: true, data: question })
  } catch (error) {
    console.error('CreateQuestion error:', error)
    res.status(500).json({ success: false, error: '创建问题失败' })
  }
}

export const deleteQuestion = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.userId

    const question = await prisma.question.findUnique({
      where: { id: parseInt(id, 10) }
    })

    if (!question) {
      res.status(404).json({ success: false, error: '问题不存在' })
      return
    }

    if (question.authorId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: '无权限删除此问题' })
      return
    }

    await prisma.question.delete({
      where: { id: parseInt(id, 10) }
    })

    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('DeleteQuestion error:', error)
    res.status(500).json({ success: false, error: '删除问题失败' })
  }
}

export const createAnswer = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { id } = req.params
    const { content } = req.body

    const question = await prisma.question.findUnique({
      where: { id: parseInt(id, 10) }
    })

    if (!question) {
      res.status(404).json({ success: false, error: '问题不存在' })
      return
    }

    const [answer] = await Promise.all([
      prisma.answer.create({
        data: {
          content,
          questionId: parseInt(id, 10),
          authorId: userId
        },
        include: {
          author: {
            select: { id: true, nickname: true, avatar: true, role: true }
          }
        }
      }),
      prisma.question.update({
        where: { id: parseInt(id, 10) },
        data: { answerCount: { increment: 1 } }
      })
    ])

    res.json({ success: true, data: answer })
  } catch (error) {
    console.error('CreateAnswer error:', error)
    res.status(500).json({ success: false, error: '创建回答失败' })
  }
}

export const acceptAnswer = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const { id, answerId } = req.params

    const question = await prisma.question.findUnique({
      where: { id: parseInt(id, 10) }
    })

    if (!question) {
      res.status(404).json({ success: false, error: '问题不存在' })
      return
    }

    if (question.authorId !== userId) {
      res.status(403).json({ success: false, error: '只有提问者可以采纳答案' })
      return
    }

    await Promise.all([
      prisma.answer.updateMany({
        where: { questionId: parseInt(id, 10) },
        data: { isAccepted: false }
      }),
      prisma.answer.update({
        where: { id: parseInt(answerId, 10) },
        data: { isAccepted: true }
      }),
      prisma.question.update({
        where: { id: parseInt(id, 10) },
        data: { hasAcceptedAnswer: true }
      })
    ])

    res.json({ success: true, message: '已采纳答案' })
  } catch (error) {
    console.error('AcceptAnswer error:', error)
    res.status(500).json({ success: false, error: '采纳答案失败' })
  }
}

export const likeAnswer = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { answerId } = req.params

    await prisma.answer.update({
      where: { id: parseInt(answerId, 10) },
      data: { likes: { increment: 1 } }
    })

    res.json({ success: true, message: '点赞成功' })
  } catch (error) {
    console.error('LikeAnswer error:', error)
    res.status(500).json({ success: false, error: '点赞失败' })
  }
}
