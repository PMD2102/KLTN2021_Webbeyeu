const mongoose = require("mongoose");
const { POST_STATUS } = require("../config/keys");

const postCommentSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  status: {
    type: Number,
    enum: [POST_STATUS.PENDING, POST_STATUS.APPROVE, POST_STATUS.REJECT],
    default: POST_STATUS.PENDING,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

module.exports = mongoose.model("post_comments", postCommentSchema);
