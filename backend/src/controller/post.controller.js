const postmodel = require("../models/post.model");
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

    res.status(201).json({
      message: "post was created successfully",
      post: populatedPost,
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

    res.status(200).json({
      message: "posts fetched successfully",
      posts,
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

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("deletePostController error:", error);
    res.status(500).json({ message: "Something went wrong while deleting the post" });
  }
}

module.exports = {
  createPostController,
  getAllPostsController,
  deletePostController,
};
