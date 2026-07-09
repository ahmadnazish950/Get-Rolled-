const express = require("express");
const authmiddleware = require("../middleware/auth.middleware");
const multer = require("multer");
const { createPostController, getAllPostsController, deletePostController } = require('../controller/post.controller')
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", 
  authmiddleware,
  upload.single("image"), 
  createPostController
);

router.get("/", authmiddleware, getAllPostsController);
router.delete("/:id", authmiddleware, deletePostController);

module.exports = router;
