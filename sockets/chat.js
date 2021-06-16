const Message = require("../models/Message");
const Room = require("../models/Room");
const { getSocketIdFromRedis } = require("./helper");

const chatSocket = (io, socket) => {
  socket.on("join-room", (payload) => {
    const { roomId, members } = payload;
    const { roomId: _roomId } = socket;
    if (!roomId || roomId === _roomId) return;
    if (_roomId) {
      socket.leave(_roomId);
    }
    socket.roomId = roomId;
    socket.roomMembers = members;
    socket.join(roomId);
  });

  socket.on("send-message", async (payload) => {
    const { file, content } = payload;
    const { userId, roomId, roomMembers } = socket;

    const newMessage = new Message({
      user: userId,
      room: roomId,
      content,
      file,
    });
    await newMessage.save();
    await Room.findByIdAndUpdate(roomId, { lastMessage: newMessage._id });
    const _newMessage = await Message.findById(newMessage._id).populate(
      "user",
      ["_id", "username", "avatar"]
    );
    for (let i = 0; i < roomMembers.length; i++) {
      let socketId = await getSocketIdFromRedis(roomMembers[i]);
      if (socketId) io.to(socketId).emit("new-message", _newMessage);
    }
    socket.to(roomId).emit("not-typing", { user: userId });
    // emit new message event to current user
    // socket.emit("new-message", newMessage);
    //emit new message event to members of room
  });

  socket.on("typing", async () => {
    if (!socket.roomId) return;
    socket.to(socket.roomId).emit("typing", { user: socket.userId });
  });

  socket.on("not-typing", async () => {
    if (!socket.roomId) return;
    socket.to(socket.roomId).emit("not-typing", { user: socket.userId });
  });

  return socket;
};

module.exports = chatSocket;
