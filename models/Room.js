const mongoose = require("mongoose");

const { ROOM_TYPE } = require("../config/keys");

const roomSchema = mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  type: {
    type: Number,
    enum: [ROOM_TYPE.PRIVATE, ROOM_TYPE.GROUP],
    default: ROOM_TYPE.PRIVATE,
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "messages",
    default: null,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

module.exports = mongoose.model("rooms", roomSchema);
