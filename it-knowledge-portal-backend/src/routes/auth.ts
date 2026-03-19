import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validation'
import { authenticate, optionalAuth } from '../middleware/auth'
import * as authController from '../controllers/authController'

const router = Router()

router.post('/login', [
  validate([
    body('username').notEmpty().withMessage('用户名不能为空'),
    body('password').notEmpty().withMessage('密码不能为空')
  ])
], authController.login)

router.post('/logout', authenticate, authController.logout)
router.get('/current', authenticate, authController.getCurrentUser)
router.get('/team', optionalAuth, authController.getTeamMembers)

export default router
