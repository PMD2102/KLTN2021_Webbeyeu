const redisClient = require("./redis");
const passportConfig = require("./passport");
const mongooseConfig = require("./mongoose");
const keys = require("./keys");

module.exports = {
  redisClient,
  passportConfig,
  mongooseConfig,
  keys,
};
