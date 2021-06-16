const { ROOM_TYPE } = require("../config/keys");
const Message = require("../models/Message");
const Room = require("../models/Room");

/**
 * create a new room with room type is group
 * @param {*} req
 * @param {*} res
 */
const createRoom = async (req, res) => {
  try {
    const { name, members, type } = req.body;
    const room = new Room({
      name,
      members,
      type,
    });
    await room.save();
    res.json(room);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

/**
 * get all rooms of user
 * @param {*} req
 * @param {*} res
 */
const getRooms = async (req, res) => {
  try {
    const { _id } = req.user;
    const rooms = await Room.find({
      members: { $all: [_id] },
      lastMessage: { $ne: null },
      // $or: [
      //   {
      //     lastMessage: { $ne: null },
      //   },
      //   {
      //     type: ROOM_TYPE.GROUP,
      //   },
      // ],
    })
      .sort({ lastMessage: "1" })
      .populate("members", ["_id", "username", "avatar", "tag"])
      .populate("lastMessage", ["content", "createdAt"]);
    res.json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getPrivateRoom = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { contactId } = req.body;
    const query = {
      members: { $all: [userId, contactId] },
      type: ROOM_TYPE.PRIVATE,
    };
    const room = await Room.findOne(query)
      .populate("members", ["_id", "username", "avatar", "tag"])
      .populate("lastMessage", ["content", "createdAt"]);
    if (room) return res.json(room);
    const newRoom = new Room({
      members: [userId, contactId],
      type: ROOM_TYPE.PRIVATE,
    });
    await newRoom.save();
    const _newRoom = await Room.findById(newRoom._id).populate("members", [
      "_id",
      "username",
      "avatar",
      "tag",
    ]);
    res.json(_newRoom);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

/**
 * message type
 * -1 all
 * 0 only text
 * 1 include image
 * 2 include file (not image)
 * @param {*} req
 * @param {*} res
 */
const getMessagesOfRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    let query = { room: id };

    // if (type) {
    //   switch (type) {
    //     case "1":
    //       query = { ...query, file: { $ne: null } };
    //   }
    // }
    const messages = await Message.find(query).populate("user", [
      "_id",
      "username",
      "avatar",
    ]);
    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createRoom,
  getRooms,
  getPrivateRoom,
  getMessagesOfRoom,
};
