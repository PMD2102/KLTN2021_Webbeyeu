const mongoose = require("mongoose");

const { ROLE, GENDER, REPORT_TYPE } = require("../config/keys");

const reportSchema = mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  type: {
    type: Number,
    enum: [REPORT_TYPE.USER, REPORT_TYPE.POST, REPORT_TYPE.COMMENT],
    default: REPORT_TYPE.USER,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post_comments",
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

module.exports = mongoose.model("reports", reportSchema);
