const express = require("express");
const authmiddleware = require("../middleware/auth.middleware");
const multer = require("multer");
const {
  createPostController,
  getAllPostsController,
  deletePostController,
  toggleLikeController,
} = require("../controller/post.controller");
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", authmiddleware, upload.single("image"), createPostController);

router.get("/", authmiddleware, getAllPostsController);
router.delete("/:id", authmiddleware, deletePostController);
router.post("/:id/like", authmiddleware, toggleLikeController);

module.exports = router;
