import express from 'express'
import verifyUser from '../middleware/verifyUser.js'
import { createComment, createPost, deletePost, getAllposts, getFollowingposts, getLikedposts, getUserposts, likeUnlikepost } from '../controller/postController.js'

const router = express.Router()

router.get('/all',verifyUser,getAllposts)
router.get("/likes/:id",verifyUser,getLikedposts)
router.get('/following',verifyUser,getFollowingposts)
router.get('/user/:username',verifyUser,getUserposts)
router.post('/create',verifyUser,createPost)
router.post('/like/:id',verifyUser,likeUnlikepost)
router.post('/comment/:id',verifyUser,createComment)
router.delete('/delete/:id',verifyUser,deletePost)



export default router