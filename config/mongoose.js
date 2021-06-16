const argon2 = require("argon2");
const mongoose = require("mongoose");
const User = require("../models/User");

const { MONGO_URI, ROLE } = require("./keys");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    // check is have ADMIN account, if NO create default ADMIN
    const admin = await User.findOne({ role: ROLE.ADMIN });
    if (!admin) {
      console.log("create default admin");
      const hashPassword = await argon2.hash("admin");
      await new User({
        name: "ADMIN",
        email: "admin",
        username: "admin",
        password: hashPassword,
        role: ROLE.ADMIN,
      }).save();
    }
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDB };
