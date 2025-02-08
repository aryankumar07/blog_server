import express from 'express'
import { getAllComments, addComment, deleteComment } from '../controller/commnet.controller.js'
import { requireAuth } from '@clerk/express'
import Auth from '../middlewares/auth.js'
const router = express.Router()

// get routes
router.get('/:postId', getAllComments)


// post routes
router.post("/:postId", requireAuth(), Auth, addComment)

// delete routes
router.post("/delete/:postId", requireAuth(), Auth, deleteComment)


export default router;
