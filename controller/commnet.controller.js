import commentModel from "../model/comment.model.js"


export const getAllComments = async (req, res, next) => {
  try {
    const postId = req.params.postId
    const comments = await commentModel.find({ post: postId }).populate("user", "username img")
    return res.status(200).json(comments)
  } catch (e) {
    console.log(e)
  }
}


export const addComment = async (req, res, next) => {
  try {
    const id = req.id
    const { desc, postId } = req.body;
    const comment = new commentModel({
      user: id,
      post: postId,
      desc: desc
    })
    const result = await comment.save()
    res.status(200).json(result)
  } catch (e) {
    console.log(e)
  }
}


export const deleteComment = (req, res, next) => {
  try {
    return res.send("Working")
  } catch (e) {
    console.log(e)
  }
}



