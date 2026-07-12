const express = require("express");
const authmiddleware = require("../middleware/auth.middleware");
const {
  createCommentController,
  getCommentsController,
  updateCommentController,
  deleteCommentController,
} = require("../controller/comment.controller");

const router = express.Router();

router.get("/post/:postId", authmiddleware, getCommentsController);
router.post("/post/:postId", authmiddleware, createCommentController);
router.patch("/:commentId", authmiddleware, updateCommentController);
router.delete("/:commentId", authmiddleware, deleteCommentController);

module.exports = router;
