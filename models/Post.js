const mongoose = require("mongoose");

const { POST_STATUS } = require("../config/keys");

const postSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "communities",
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
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

module.exports = mongoose.model("posts", postSchema);
