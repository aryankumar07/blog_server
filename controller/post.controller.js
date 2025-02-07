import Post from '../model/post.model.js'
import { imagekit } from '../utils/image.js'

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2
    const posts = await Post.find().limit(limit).skip((page - 1) * limit)
    const totalPosts = await Post.countDocuments()
    const hasMore = page * limit < totalPosts
    return res.status(200).json({ posts, hasMore })
  } catch (e) {
    console.log(`[error in getPost] : ${e.message} `)
  }
}



export const getSinglePost = async (req, res) => {
  try {
    const slug = req.params.slug
    const post = await Post.findOne({
      slug: slug
    })
    return res.status(200).json(post)
  } catch (e) {
    console.log(`[error in single Post], ${e.message}`)
  }
}


export const createPost = async (req, res) => {
  try {
    const id = req.id
    let slug = req.body.title.replace(/ /g, '-').toLowerCase();
    let existingPost = await Post.findOne({ slug })
    let counter = 2;
    while (existingPost) {
      slug = `${slug}-${counter}`
      existingPost = await Post.findOne({ slug })
      counter++
    }

    const newPost = new Post({ user: id, slug: slug, ...req.body })
    const post = await newPost.save()
    return res.status(200).json(post)
  } catch (e) {
    console.log(`[Create Post], ${e.message}`)
  }
}




export const deletePost = async (req, res) => {
  try {
    await Post.findOneAndDelete({ _id: req.params.id, user: req.id })
    return res.status(200).json({
      message: "deleted post"
    })
  } catch (e) {
    console.log(`[delete Post], ${e.message}`)
  }
}


export const uploadAuth = async (req, res) => {
  var result = imagekit.getAuthenticationParameters();
  res.send(result);
}



