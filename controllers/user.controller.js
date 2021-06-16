const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");

const { keys, redisClient } = require("../config");
const { nodemailer } = require("../services");
const { signUpValidation, signInValidation } = require("../validation/auth");

const User = require("../models/User");
const { ROLE, EMAIL_TYPE, PROVIDER } = require("../config/keys");
const { sendMail } = require("../services/nodemailer");
const Notification = require("../models/Notification");

const signUp = async (req, res) => {
  try {
    // const { isValid, errors } = signUpValidation(req.body);
    // // check validate data
    // if (!isValid) return res.status(400).json(errors);

    const { name, username, email, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
      // provider: PROVIDER.LOCAL,
    });
    // console.log(user);

    if (user) {
      return res.status(400).send("Username hoặc email đã được sử dụng");
    }

    const hashPassword = await argon2.hash(password);
    const newUser = new User({
      name,
      username,
      email,
      password: hashPassword,
    });

    // save user to db
    await newUser.save();

    const payload = {
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      avatar: newUser.avatar,
      role: newUser.role,
    };
    const token = await jwt.sign(payload, keys.SECRET_KEY_JWT, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (error) {
    // console.log(error);
    res.status(500).json(error);
  }
};

const signIn = async (req, res) => {
  try {
    // const { isValid, errors } = signInValidation(req.body);
    // check validate data
    // if (!isValid) return res.status(400).json(errors);
    const { username, password } = req.body;
    // check user is exists
    const user = await User.findOne({
      username: username,
      isDelete: false,
      // provider: PROVIDER.LOCAL,
    });
    if (!user) return res.status(400).send("Tài khoản không tồn tại");
    if (!user.isActivate)
      return res
        .status(400)
        .send("Tài khoản đã bị khóa, liên hệ admin để giải quyết");
    // check user is verify
    // check password is match
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) return res.status(400).send("Sai mật khẩu");
    // create token
    const payload = {
      _id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      tag: user.tag,
      role: user.role,
    };
    const token = await jwt.sign(payload, keys.SECRET_KEY_JWT, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const facebookSignIn = async (req, res) => {
  try {
    // const { isValid, errors } = signUpValidation(req.body);
    // // check validate data
    // if (!isValid) return res.status(400).json(errors);

    const { name, email, userID } = req.body;

    const user = await User.findOne({
      // provider: PROVIDER.FACEBOOK,
      username: userID,
      email: email,
    });
    // console.log(user);

    if (user) {
      const payload = {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        tag: user.tag,
        role: user.role,
      };
      const token = await jwt.sign(payload, keys.SECRET_KEY_JWT, {
        expiresIn: "24h",
      });
      return res.json({ token });
    }

    const newUser = new User({
      name,
      username: userID,
      email,
      provider: PROVIDER.FACEBOOK,
    });

    // save user to db
    await newUser.save();

    const payload = {
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      avatar: newUser.avatar,
      role: newUser.role,
    };
    const token = await jwt.sign(payload, keys.SECRET_KEY_JWT, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const { q } = req.query;
    let query = { role: ROLE.USER, isDelete: false };
    if (q)
      query = {
        ...query,
        username: { $regex: new RegExp(q.toString(), "gi") },
      };
    const users = await User.find(query);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).send("NOT_FOUND");
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId, role: userRole } = req.user;
    if (id != userId && userRole === ROLE.USER)
      return res.status(401).send("Unauthorized");

    const user = await User.findByIdAndUpdate(id, req.body, {
      // upsert: true,
      new: true,
    });

    const { name, username, avatar, role } = req.body;

    if (name || username || avatar || role) {
      const payload = {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      };
      const token = await jwt.sign(payload, keys.SECRET_KEY_JWT, {
        expiresIn: "24h",
      });
      return res.json({ token });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const changePassword = async (req, res) => {
  try {
    const { _id } = req.user;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(_id);
    if (!user) return res.status(401).send("Unauthorized");

    const isMatch = await argon2.verify(user.password, currentPassword);
    if (!isMatch) return res.status(400).send("Mật khẩu hiện tại không chính xác !");

    const hashPassword = await argon2.hash(newPassword);
    const _user = await User.findByIdAndUpdate(
      _id,
      {
        password: hashPassword,
      },
      {
        new: true,
      }
    );
    res.json(_user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const lockOrUnlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const { isActivate } = req.body;
    if (id === userId) return res.status(401).send("Unauthorized");
    const user = await User.findOneAndUpdate(
      { _id: id, isActivate: isActivate },
      {
        isActivate: !isActivate,
      },
      {
        new: true,
      }
    );
    console.log(user);
    if (!user) return res.status(401).send("User is locked or activated");
    res.send("Success");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

function randomPassword(length) {
  var result = [];
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[{}};:.,/?";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.status(400).send("Email chưa được đăng ký");
    }
    console.log(user);
    const id  = user._id;
    const password = randomPassword(8);
    const hashPassword = await argon2.hash(password);
    await sendMail(
      user.email,
      "Quên mật khẩu cộng đồng Webbyeu",
      password,
      EMAIL_TYPE.RESET_PASS
    );
    await User.findByIdAndUpdate(id, { password: hashPassword });
    res.send("Success");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;
    if (id === userId) return res.status(401).send("Unauthorized");
    const user = await User.findById(id);
    if (!user) return res.status(401).send("User is not exists");
    await User.findByIdAndUpdate(id, { isDelete: true });
    res.send("Success");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getNotifications = async (req, res) => {
  try {
    const { _id } = req.user;
    const notifications = await Notification.find({ user: _id, isRead: false });
    res.json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const readNotifications = async (req, res) => {
  try {
    const { _id } = req.user;
    await Notification.updateMany(
      { user: _id, isRead: false },
      { isRead: true }
    );
    res.send("Success");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  signUp,
  signIn,
  facebookSignIn,
  getUsers,
  getUser,
  updateUser,
  changePassword,
  lockOrUnlockUser,
  resetPassword,
  deleteUser,
  getNotifications,
  readNotifications,
};
