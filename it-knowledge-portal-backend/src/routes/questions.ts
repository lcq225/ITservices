import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import * as qaController from '../controllers/qaController'

const router = Router()

router.get('/', qaController.getQuestions)
router.get('/:id', qaController.getQuestionById)

router.post('/', authenticate, [
  validate([
    body('title').notEmpty().withMessage('标题不能为空'),
    body('content').notEmpty().withMessage('内容不能为空'),
    body('tags').isArray().withMessage('标签必须是数组')
  ])
], qaController.createQuestion)

router.delete('/:id', authenticate, qaController.deleteQuestion)

router.post('/:id/answers', authenticate, [
  validate([
    body('content').notEmpty().withMessage('回答内容不能为空')
  ])
], qaController.createAnswer)

router.post('/:id/answers/:answerId/accept', authenticate, qaController.acceptAnswer)

router.post('/answers/:answerId/like', authenticate, qaController.likeAnswer)

export default router
