const Redis = require("ioredis");
const { REDIS_PORT, REDIS_HOST, REDIS_PASS } = require("./keys");

const redis = new Redis({
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASS,
});

const redisClient = (function redisConfig() {
  redis.on("error", function (error) {
    console.error(error);
  });

  redis.on("connect", function () {
    console.log("Redis connected");
  });
  return redis;
})();

module.exports = redisClient;
