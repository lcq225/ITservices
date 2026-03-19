import { Router } from 'express'
import { authenticate, requireRole } from '../middleware/auth'
import * as systemController from '../controllers/systemController'

const router = Router()

router.get('/', systemController.getSystems)
router.get('/:id', systemController.getSystemById)

router.post('/', authenticate, requireRole('ADMIN'), systemController.createSystem)
router.put('/:id', authenticate, requireRole('ADMIN'), systemController.updateSystem)
router.delete('/:id', authenticate, requireRole('ADMIN'), systemController.deleteSystem)

export default router
