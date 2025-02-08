import express from 'express'
import 'dotenv/config.js'
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import commentRoute from './routes/comment.route.js'
import webhookRoute from './routes/webHooks.route.js'
import connectToDb from './utils/connectdb.js'
import cors from 'cors'


const app = express()

//general middleware
app.use(cors())
app.use('/webhooks', webhookRoute)
app.use(express.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.get('/', (req, res) => {
  res.send("You have Stumbled upon the server for blogs")
})

app.get('/auth-state', async (req, res) => {
  const authState = req.auth
  return res.json(authState)
})


// routes
app.use('/user', userRoute)
app.use('/posts', postRoute)
app.use('/comments', commentRoute)


app.listen(3000, () => {
  console.log("server is runnig")
  connectToDb()
})
