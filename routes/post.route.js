import express from 'express'
const router = express.Router()
import { getPosts, getSinglePost, createPost, deletePost, uploadAuth } from '../controller/post.controller.js'
import Auth from '../middlewares/auth.js'
import { requireAuth } from '@clerk/express'



router.get('/upload-auth', uploadAuth)

// get routes
router.get('/', getPosts)
router.get('/:slug', getSinglePost)



//post routes
router.post('/', requireAuth(), Auth, createPost)



//post delete
router.delete('/:id', requireAuth(), Auth, deletePost)


export default router;


