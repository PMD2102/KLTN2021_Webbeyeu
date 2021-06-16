const mongoose = require("mongoose");

const { ROLE, GENDER, PROVIDER } = require("../config/keys");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  provider: {
    type: Number,
    enum: [PROVIDER.LOCAL, PROVIDER.FACEBOOK],
    default: PROVIDER.LOCAL,
  },
  password: {
    type: String,
  },
  avatar: {
    type: String,
  },
  role: {
    type: Number,
    enum: [ROLE.ADMIN, ROLE.USER],
    default: ROLE.USER,
  },
  gender: {
    type: Number,
    enum: [GENDER.OTHER, GENDER.MALE, GENDER.FEMALE],
    default: GENDER.OTHER,
  },
  tag: {
    type: String,
  },
  phone: {
    type: String,
  },
  idCard: {
    type: String,
  },
  idCardTime: {
    type: String,
  },
  idCardPlace: {
    type: String,
  },
  isActivate: {
    type: Boolean,
    default: true,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

module.exports = mongoose.model("users", userSchema);
