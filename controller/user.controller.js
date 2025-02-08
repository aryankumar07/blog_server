import User from "../model/user.model.js"


export const getUserId = (req, res, next) => {
  try {
    const id = req.id
    return res.status(200).json(id)
  } catch (e) {
    console.log(e)
  }
}


export const getUserSavedPost = async (req, res, next) => {
  try {
    const id = req.id
    const user = await User.findById(id);
    return res.status(200).json(user.savedPosts)
  } catch (e) {
    console.log(e)
  }
}


export const savePost = async (req, res, next) => {
  try {
    const id = req.id
    const postId = req.body.postId;
    const user = await User.findById(id);
    const isSaved = user.savedPosts.some((p) => p === postId);
    if (!isSaved) {
      await User.findByIdAndUpdate(user._id, {
        $push: { savedPosts: postId },
      });
    } else {
      await User.findByIdAndUpdate(user._id, {
        $pull: { savedPosts: postId },
      });
    }
    return res.status(200).json(isSaved ? "Post unsaved" : "Post saved");
  } catch (e) {
    console.log(e)
  }
}
