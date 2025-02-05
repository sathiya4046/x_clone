import express from 'express'
import verifyUser from '../middleware/verifyUser.js'
import { deleteNotifications, getNotifications } from '../controller/notificationController.js'

const router = express.Router()

router.get('/',verifyUser,getNotifications)
router.delete('/',verifyUser,deleteNotifications)

export default router