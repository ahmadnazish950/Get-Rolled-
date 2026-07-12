const postmodel = require("../models/post.model");
const commentmodel = require("../models/comment.model");
const generateCaption = require("../service/ai.service");
const { uploadFile, deleteFile } = require("../service/storage.service");
const { v4: uuidv4 } = require("uuid");

async function createPostController(req, res) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const base64Image = new Buffer.from(file.buffer).toString("base64");

    const caption = await generateCaption(base64Image);

    const result = await uploadFile(file.buffer, `${uuidv4()}`);

    const post = await postmodel.create({
      caption: caption,
      image: result.url,
      imageId: result.fileId,
      user: req.user._id,
    });

    const populatedPost = await postmodel
      .findById(post._id)
      .populate("user", "username");

    const postObj = populatedPost.toObject();
    postObj.likesCount = 0;
    postObj.commentsCount = 0;

    res.status(201).json({
      message: "post was created successfully",
      post: postObj,
    });
  } catch (error) {
    console.error("createPostController error:", error);
    res.status(500).json({ message: "Something went wrong while creating the post" });
  }
}

async function getAllPostsController(req, res) {
  try {
    const posts = await postmodel
      .find()
      .sort({ _id: -1 })
      .populate("user", "username");

    const commentCounts = await commentmodel.aggregate([
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(commentCounts.map((c) => [c._id.toString(), c.count]));

    const postsWithCounts = posts.map((post) => {
      const obj = post.toObject();
      obj.likesCount = (post.likes || []).length;
      obj.commentsCount = countMap.get(post._id.toString()) || 0;
      return obj;
    });

    res.status(200).json({
      message: "posts fetched successfully",
      posts: postsWithCounts,
    });
  } catch (error) {
    console.error("getAllPostsController error:", error);
    res.status(500).json({ message: "Something went wrong while fetching posts" });
  }
}

async function deletePostController(req, res) {
  try {
    const { id } = req.params;

    const post = await postmodel.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await deleteFile(post.imageId);
    await postmodel.findByIdAndDelete(id);
    await commentmodel.deleteMany({ post: id });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("deletePostController error:", error);
    res.status(500).json({ message: "Something went wrong while deleting the post" });
  }
}

async function toggleLikeController(req, res) {
  try {
    const { id } = req.params;

    const post = await postmodel.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some((likeId) => likeId.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((likeId) => likeId.toString() !== userId);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Like removed" : "Post liked",
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("toggleLikeController error:", error);
    res.status(500).json({ message: "Something went wrong while updating the like" });
  }
}

module.exports = {
  createPostController,
  getAllPostsController,
  deletePostController,
  toggleLikeController,
};
