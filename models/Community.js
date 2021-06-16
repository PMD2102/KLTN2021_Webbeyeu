const mongoose = require("mongoose");

const communitySchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  introduce: {
    type: String,
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

module.exports = mongoose.model("communities", communitySchema);
