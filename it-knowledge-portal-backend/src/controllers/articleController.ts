import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { ApiResponse, AuthRequest, CreateArticleDto, UpdateArticleDto, PaginatedResponse } from '../types'
import { ArticleWithDetails } from '../types'

const prisma = new PrismaClient()

export const getArticles = async (
  req: AuthRequest,
  res: Response<ApiResponse<PaginatedResponse<ArticleWithDetails>>>
): Promise<void> => {
  try {
    const { type, systemId, tag, keyword, page = '1', pageSize = '10' } = req.query
    const pageNum = parseInt(page as string, 10)
    const pageSizeNum = parseInt(pageSize as string, 10)
    const skip = (pageNum - 1) * pageSizeNum

    const where: any = {}
    if (type) where.type = type
    if (systemId) where.systemId = parseInt(systemId as string, 10)
    if (keyword) {
      where.OR = [
        { title: { contains: keyword as string, mode: 'insensitive' } },
        { content: { contains: keyword as string, mode: 'insensitive' } }
      ]
    }
    if (tag) where.tags = { has: tag as string }
    where.status = 'PUBLISHED'

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: pageSizeNum,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, nickname: true, avatar: true, role: true }
          },
          system: {
            select: { id: true, name: true, code: true }
          },
          attachments: true
        }
      }),
      prisma.article.count({ where })
    ])

    res.json({
      success: true,
      data: {
        list: articles,
        total,
        page: pageNum,
        pageSize: pageSizeNum
      }
    })
  } catch (error) {
    console.error('GetArticles error:', error)
    res.status(500).json({ success: false, error: '获取文章列表失败' })
  }
}

export const getArticleById = async (
  req: AuthRequest,
  res: Response<ApiResponse<ArticleWithDetails>>
): Promise<void> => {
  try {
    const { id } = req.params

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        author: {
          select: { id: true, nickname: true, avatar: true, role: true }
        },
        system: {
          select: { id: true, name: true, code: true }
        },
        attachments: true
      }
    })

    if (!article) {
      res.status(404).json({ success: false, error: '文章不存在' })
      return
    }

    await prisma.article.update({
      where: { id: parseInt(id, 10) },
      data: { views: { increment: 1 } }
    })

    res.json({ success: true, data: article })
  } catch (error) {
    console.error('GetArticleById error:', error)
    res.status(500).json({ success: false, error: '获取文章详情失败' })
  }
}

export const createArticle = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const userId = req.user!.userId
    const data: CreateArticleDto = req.body

    const article = await prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type,
        systemId: data.systemId,
        tags: data.tags,
        authorId: userId,
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: { id: true, nickname: true, avatar: true, role: true }
        }
      }
    })

    res.json({ success: true, data: article })
  } catch (error) {
    console.error('CreateArticle error:', error)
    res.status(500).json({ success: false, error: '创建文章失败' })
  }
}

export const updateArticle = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.userId
    const data: UpdateArticleDto = req.body

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id, 10) }
    })

    if (!article) {
      res.status(404).json({ success: false, error: '文章不存在' })
      return
    }

    if (article.authorId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: '无权限修改此文章' })
      return
    }

    const updated = await prisma.article.update({
      where: { id: parseInt(id, 10) },
      data: {
        title: data.title,
        content: data.content,
        type: data.type,
        systemId: data.systemId,
        tags: data.tags,
        status: data.status
      },
      include: {
        author: {
          select: { id: true, nickname: true, avatar: true, role: true }
        }
      }
    })

    res.json({ success: true, data: updated })
  } catch (error) {
    console.error('UpdateArticle error:', error)
    res.status(500).json({ success: false, error: '更新文章失败' })
  }
}

export const deleteArticle = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.userId

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id, 10) }
    })

    if (!article) {
      res.status(404).json({ success: false, error: '文章不存在' })
      return
    }

    if (article.authorId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: '无权限删除此文章' })
      return
    }

    await prisma.article.delete({
      where: { id: parseInt(id, 10) }
    })

    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('DeleteArticle error:', error)
    res.status(500).json({ success: false, error: '删除文章失败' })
  }
}

export const likeArticle = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params

    await prisma.article.update({
      where: { id: parseInt(id, 10) },
      data: { likes: { increment: 1 } }
    })

    res.json({ success: true, message: '点赞成功' })
  } catch (error) {
    console.error('LikeArticle error:', error)
    res.status(500).json({ success: false, error: '点赞失败' })
  }
}
