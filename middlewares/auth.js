import User from "../model/user.model.js"
import { clerkClient, getAuth } from '@clerk/express'


const Auth = async (req, res, next) => {
  try {
    const clerkUserId = req.auth.userId
    if (!clerkUserId) {
      return res.status(400).json({
        msg: "UnAuthorized User"
      })
    }

    const user = await User.findOne({ clerkUserId })
    if (!user) {
      return res.status(400).json({
        msg: 'No User found'
      })
    }
    req.id = user._id
    next()
  } catch (e) {
    console.log(`[Auth error] : ${e.message}`)
  }
}


export default Auth
