import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validation'
import { authenticate, requireRole } from '../middleware/auth'
import * as articleController from '../controllers/articleController'

const router = Router()

router.get('/', articleController.getArticles)
router.get('/:id', articleController.getArticleById)

router.post('/', authenticate, requireRole('IT', 'ADMIN'), [
  validate([
    body('title').notEmpty().withMessage('标题不能为空'),
    body('content').notEmpty().withMessage('内容不能为空'),
    body('type').isIn(['KNOWLEDGE', 'NEWS']).withMessage('类型无效'),
    body('tags').isArray().withMessage('标签必须是数组')
  ])
], articleController.createArticle)

router.put('/:id', authenticate, requireRole('IT', 'ADMIN'), articleController.updateArticle)

router.delete('/:id', authenticate, requireRole('IT', 'ADMIN'), articleController.deleteArticle)

router.post('/:id/like', authenticate, articleController.likeArticle)

export default router
