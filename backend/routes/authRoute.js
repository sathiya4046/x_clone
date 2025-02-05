import express from 'express'
import { getMe, logout, signIn, signUp } from '../controller/authController.js'
import verifyUser from '../middleware/verifyUser.js'

const router = express.Router()

router.post('/signUp',signUp)
router.post('/signIn',signIn)
router.post('/logout',logout)
router.get('/me',verifyUser,getMe)


export default router