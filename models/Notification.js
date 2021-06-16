const mongoose = require("mongoose");
const { NOTIFY_TYPE, POST_STATUS } = require("../config/keys");

const postCommentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  type: {
    type: Number,
    enum: [NOTIFY_TYPE.post, NOTIFY_TYPE.comment],
    required: true,
  },
  status: {
    type: Number,
    enum: [POST_STATUS.PENDING, POST_STATUS.APPROVE, POST_STATUS.REJECT],
    required: true,
  },
  object: {
    type: String,
    require: true,
  },

  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

module.exports = mongoose.model("notifications", postCommentSchema);
