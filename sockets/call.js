const { getSocketIdFromRedis } = require("./helper");

const users = {};

const socketToRoom = {};

const callSocket = (io, socket) => {
  socket.on("start-call", async () => {
    const { userId, roomId, roomMembers } = socket;
    console.log(socket.roomMembers);
    socketJoinRoomCall(roomId);

    for (let i = 0; i < roomMembers.length; i++) {
      if (roomMembers[i] === userId) continue;
      let socketId = await getSocketIdFromRedis(roomMembers[i]);
      if (socketId) io.to(socketId).emit("offer-call", { roomId });
    }
  });

  socket.on("accept-call", ({ roomId }) => {
    const { userId } = socket;
    console.log(roomId);
    socketJoinRoomCall(roomId);
  });

  socket.on("join room", (roomID) => {
    console.log(roomID);
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 4) {
        socket.emit("room full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
  });

  const socketJoinRoomCall = (roomId) => {
    const { roomCallId } = socket;
    if (roomId === roomCallId) return;
    if (roomCallId) socket.leave(roomCallId);

    socket.roomCallId = roomId;
    socket.join(roomId);
  };
};

module.exports = callSocket;
