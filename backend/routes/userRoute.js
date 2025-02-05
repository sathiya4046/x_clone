import express from 'express'
import verifyUser from '../middleware/verifyUser.js'
import { followUnfollowuser, getFollowers, getFollowing, getProfile, getSuggestUser, updateUser } from '../controller/userController.js'

const router = express.Router()

router.get('/profile/:username',verifyUser,getProfile)
router.post('/follow/:id',verifyUser,followUnfollowuser)
router.get('/suggested',verifyUser,getSuggestUser)
router.get('/followers',verifyUser,getFollowers)
router.get('/following',verifyUser,getFollowing)
router.post('/update',verifyUser,updateUser)


export default router