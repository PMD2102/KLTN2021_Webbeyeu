const mongoose = require("mongoose");

const postLikeSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
    require: true,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

module.exports = mongoose.model("post_likes", postLikeSchema);
