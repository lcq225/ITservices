import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import * as uploadController from '../controllers/uploadController'

const router = Router()

router.post('/', authenticate, uploadController.upload.single('file'), uploadController.uploadAttachment)
router.delete('/:id', authenticate, uploadController.deleteAttachment)

export default router
