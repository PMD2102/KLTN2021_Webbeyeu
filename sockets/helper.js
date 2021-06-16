const { redisClient } = require("../config");
const { SOCKET_PREFIX } = require("../config/keys");

const getSocketIdFromRedis = (userId) => {
  return new Promise(async (resolve, _) => {
    const socketId = await redisClient.get(`${SOCKET_PREFIX}:${userId}`);
    resolve(socketId);
  });
};

module.exports = {
  getSocketIdFromRedis,
};
