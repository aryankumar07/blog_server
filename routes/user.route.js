import { requireAuth } from '@clerk/express'
import express from 'express'
import Auth from '../middlewares/auth.js'
const router = express.Router()
import { getUserSavedPost, savePost, getUserId } from '../controller/user.controller.js'


router.get('/test', (req, res) => {
  res.status(200).json({
    message: "Working"
  })
})



router.get('/userId', requireAuth(), Auth, getUserId)


router.get('/saved', requireAuth(), Auth, getUserSavedPost)


router.patch('/save', requireAuth(), Auth, savePost)




export default router;


