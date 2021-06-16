const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "rooms",
  },
  content: {
    type: String,
  },
  file: {
    originalname: {
      type: String,
    },
    mimetype: {
      type: String,
    },
    filename: {
      type: String,
    },
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

module.exports = mongoose.model("messages", conversationSchema);
