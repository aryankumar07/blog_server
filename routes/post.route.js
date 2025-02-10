import express from 'express'
const router = express.Router()
import { getPosts, getSinglePost, createPost, deletePost, uploadAuth, featurePost, getFeaturedPost } from '../controller/post.controller.js'
import Auth from '../middlewares/auth.js'
import { requireAuth } from '@clerk/express'
import increaseVisit from '../middlewares/increaseVisit.js'



router.get('/upload-auth', uploadAuth)

// get routes
router.get('/', getPosts)
router.get('/featuredPost', getFeaturedPost)
router.get('/:slug', increaseVisit, getSinglePost)



//post routes
router.post('/', requireAuth(), Auth, createPost)
router.post('/feature', featurePost)



//post delete
router.delete('/:id', requireAuth(), Auth, deletePost)




export default router;


