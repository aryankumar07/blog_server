import express from 'express'
const router = express.Router()
import bodyParser from 'body-parser'
import { clerkWebhook } from '../controller/webhook.controller.js'

router.post('/clerk', bodyParser.raw({ type: 'application/json' }), clerkWebhook)


export default router
