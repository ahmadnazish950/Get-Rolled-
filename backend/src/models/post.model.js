const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  image: String,
  imageId: String, // ImageKit's fileId, needed to delete the file from storage later
  caption: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const postmodel = mongoose.model("post", postSchema);

module.exports = postmodel;

