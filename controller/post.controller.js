import Post from '../model/post.model.js'
import User from '../model/user.model.js'
import { imagekit } from '../utils/image.js'

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2
    const query = {}
    const cat = req.query.cat
    const author = req.query.author
    const searchQuery = req.query.search
    const sortQuery = req.query.sort
    const featured = req.query.featured

    if (cat) {
      query.category = cat;
    }

    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: "i" };
    }

    if (author) {
      const user = await User.findOne({ username: author }).select("_id");

      if (!user) {
        return res.status(404).json("No post found!");
      }

      query.user = user._id;
    }

    let sortObj = { createdAt: -1 };


    if (sortQuery) {
      switch (sortQuery) {
        case "newest":
          sortObj = { createdAt: -1 };
          break;
        case "oldest":
          sortObj = { createdAt: 1 };
          break;
        case "popular":
          sortObj = { visit: -1 };
          break;
        case "trending":
          sortObj = { visit: -1 };
          query.createdAt = {
            $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          };
          break;
        default:
          break;
      }
    }

    if (featured) {
      query.isFeatured = true;
    }

    const posts = await Post.find(query)
      .populate("user", "username")
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit);

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
    }).populate("user", "username img")
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



export const featurePost = async (req, res, next) => {
  try {
    const query = Post.find()

    const postIdArray = await Post.find()

    const posts = await query.where({ isFeatured: true })

    posts.map(async (post) => {
      await Post.findByIdAndUpdate(post._id, { isFeatured: false })
    })

    const Postlength = await Post.countDocuments()

    Array.from({ length: 4 }).map(async (_) => {
      const index = Math.round(Math.random() * Postlength)
      await Post.findByIdAndUpdate(postIdArray[index]._id, { isFeatured: true })
    })

    return res.status(200).json({
      msg: "updated post"
    })
  } catch (e) {
    console.log(`[Feature post], ${e}`)
  }
}



export const getFeaturedPost = async (req, res, next) => {
  try {
    const posts = await Post.find().where({ isFeatured: true })
    return res.status(200).json(posts)
  } catch (e) {
    console.log(`[getFeatured Post], ${e}`)
  }
}






export const uploadAuth = async (req, res) => {
  var result = imagekit.getAuthenticationParameters();
  res.send(result);
}



