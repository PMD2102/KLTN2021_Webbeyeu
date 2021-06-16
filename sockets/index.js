const jwt = require("jsonwebtoken");
const { redisClient } = require("../config");
const { SECRET_KEY_JWT, SOCKET_PREFIX } = require("../config/keys");
const chatSocket = require("./chat");
const callSocket = require("./call");

const rootSocket = (io) => {
  global.socketIo = io;
  io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(
        socket.handshake.query.token,
        SECRET_KEY_JWT,
        function (err, decoded) {
          if (err) return next(new Error("Unauthenticated"));
          socket.userId = decoded._id;
          next();
        }
      );
    } else {
      console.log("not token");
      next(new Error("Authentication error"));
    }
  }).on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`);

    // save socket id to redis
    redisClient.set(`${SOCKET_PREFIX}:${socket.userId}`, socket.id);

    // socket.on("join-room", (payload) => {
    //   console.log(payload);
    // });

    chatSocket(io, socket);
    // callSocket(io, socket);

    socket.on("disconnect", function () {
      console.log("user disconnect!");
      redisClient.del(`${SOCKET_PREFIX}:${socket.userId}`);
    });
  });
  return io;
};

module.exports = rootSocket;
