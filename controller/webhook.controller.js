import User from "../model/user.model.js";
import Post from "../model/post.model.js";
import Comment from "../model/comment.model.js";
import { Webhook } from "svix";



export const clerkWebhook = async (req, res) => {
  const webhook_secret = process.env.WEBHOOK_SECRET
  if (!webhook_secret) {
    throw new Error('WEbhooks secret not provided')
  }
  const payload = req.body
  const headers = req.headers
  const wh = new Webhook(webhook_secret);
  let evt;
  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    res.status(400).json({
      message: "Webhook verification failed!",
    });
  }
  if (evt.type === "user.created") {
    const newUser = new User({
      clerkUserId: evt.data.id,
      username: evt.data.username || evt.data.email_addresses[0].email_address,
      email: evt.data.email_addresses[0].email_address,
      img: evt.data.profile_img_url,
    });

    await newUser.save();
  }

  if (evt.type === "user.deleted") {
    const deletedUser = await User.findOneAndDelete({
      clerkUserId: evt.data.id,
    });

    await Post.deleteMany({ user: deletedUser._id })
    await Comment.deleteMany({ user: deletedUser._id })
  }

  return res.status(200).json({
    message: "Webhook received",
  });
}
