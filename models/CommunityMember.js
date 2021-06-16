const mongoose = require("mongoose");

const { ROLE, GENDER } = require("../config/keys");

const communityMemberSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "communities",
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

module.exports = mongoose.model("community_members", communityMemberSchema);
