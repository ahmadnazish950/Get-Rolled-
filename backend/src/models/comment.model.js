const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
      default: null,
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const commentmodel = mongoose.model("comment", commentSchema);

module.exports = commentmodel;
