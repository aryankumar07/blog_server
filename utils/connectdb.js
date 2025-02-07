import mongoose from "mongoose"

const connecToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('connected to mongo')
  } catch (e) {
    console.log(`[connection error] : error in connecting to mongo`)
  }
}


export default connecToDb
