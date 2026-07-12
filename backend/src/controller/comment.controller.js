const commentmodel = require("../models/comment.model");
const postmodel = require("../models/post.model");

async function createCommentController(req, res) {
  try {
    const { postId } = req.params;
    const { text, parentId } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment can't be empty" });
    }

    const post = await postmodel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (parentId) {
      const parentComment = await commentmodel.findById(parentId);
      if (!parentComment || parentComment.post.toString() !== postId) {
        return res.status(404).json({ message: "Comment being replied to was not found" });
      }
    }

    const comment = await commentmodel.create({
      text: text.trim(),
      post: postId,
      user: req.user._id,
      parent: parentId || null,
    });

    const populatedComment = await commentmodel
      .findById(comment._id)
      .populate("user", "username");

    res.status(201).json({
      message: "Comment added",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("createCommentController error:", error);
    res.status(500).json({ message: "Something went wrong while posting the comment" });
  }
}

async function getCommentsController(req, res) {
  try {
    const { postId } = req.params;

    const comments = await commentmodel
      .find({ post: postId })
      .sort({ createdAt: 1 })
      .populate("user", "username");

    res.status(200).json({
      message: "Comments fetched",
      comments,
    });
  } catch (error) {
    console.error("getCommentsController error:", error);
    res.status(500).json({ message: "Something went wrong while fetching comments" });
  }
}

async function updateCommentController(req, res) {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment can't be empty" });
    }

    const comment = await commentmodel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own comments" });
    }

    comment.text = text.trim();
    comment.edited = true;
    await comment.save();

    const populatedComment = await commentmodel
      .findById(comment._id)
      .populate("user", "username");

    res.status(200).json({
      message: "Comment updated",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("updateCommentController error:", error);
    res.status(500).json({ message: "Something went wrong while updating the comment" });
  }
}

async function collectDescendantIds(commentId, acc) {
  const children = await commentmodel.find({ parent: commentId }).select("_id");
  for (const child of children) {
    acc.push(child._id);
    await collectDescendantIds(child._id, acc);
  }
  return acc;
}

async function deleteCommentController(req, res) {
  try {
    const { commentId } = req.params;

    const comment = await commentmodel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    const idsToDelete = await collectDescendantIds(comment._id, [comment._id]);
    await commentmodel.deleteMany({ _id: { $in: idsToDelete } });

    res.status(200).json({
      message: "Comment deleted",
      deletedIds: idsToDelete,
    });
  } catch (error) {
    console.error("deleteCommentController error:", error);
    res.status(500).json({ message: "Something went wrong while deleting the comment" });
  }
}

module.exports = {
  createCommentController,
  getCommentsController,
  updateCommentController,
  deleteCommentController,
};
