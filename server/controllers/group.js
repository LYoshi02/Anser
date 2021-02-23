const { ObjectId } = require("mongodb");

const Chat = require("../models/Chat");
const User = require("../models/User");
const { getIO } = require("../socket");

exports.addMembers = async (req, res, next) => {
  const userId = req.userId;
  const { newMembers, chatId } = req.body;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [userId] },
    }).populate([
      {
        path: "users",
        select: "username fullname profileImage.url",
      },
      {
        path: "messages.sender",
        select: "username fullname profileImage.url",
      },
    ]);

    if (!chat) {
      const error = new Error("Chat no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const senderData = chat.users.find((u) => u._id.toString() === userId);
    const newMembersData = await User.find({
      _id: { $in: [...newMembers] },
    });
    const addMembersMessages = [];
    for await (let member of newMembersData) {
      addMembersMessages.push({
        sender: senderData,
        text: `@${senderData.username} ha añadido a @${member.username}`,
        global: true,
      });
      member.chats.push(chat._id);
      await member.save();
    }

    const previousUsers = [...chat.users];
    chat.users.push(...newMembers);
    chat.messages.push(...addMembersMessages);

    await chat.save();

    let result = chat.toObject();
    const newMembersFormatted = newMembersData.map(
      ({ _id, username, fullname, profileImage }) => {
        return {
          _id,
          username,
          fullname,
          profileImage: { url: profileImage.url },
        };
      }
    );
    result = {
      ...result,
      users: [...previousUsers, ...newMembersFormatted],
    };

    chat.users.forEach((receiver) => {
      if (receiver._id.toString() !== userId) {
        getIO().to(receiver._id.toString()).emit("newChat", { chat: result });
      }
    });
    res.status(200).json({ chat: result });
  } catch (error) {
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  const userId = req.userId;
  const { memberId, chatId } = req.body;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [userId] },
    }).populate([
      {
        path: "users",
        select: "username fullname profileImage.url",
      },
      {
        path: "messages.sender",
        select: "username fullname profileImage.url",
      },
    ]);

    if (!chat || !chat.group) {
      const error = new Error("Chat no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const senderData = chat.users.find((u) => u._id.toString() === userId);
    const removedMember = chat.users.find((u) => u._id.toString() === memberId);
    chat.messages.push({
      sender: senderData,
      text: `@${senderData.username} ha eliminado a @${removedMember.username}`,
      global: true,
    });
    const previousUsers = [...chat.users];
    chat.users.pull(memberId);
    const result = await chat.save();

    previousUsers.forEach((receiver) => {
      if (receiver._id.toString() !== userId) {
        getIO()
          .to(receiver._id.toString())
          .emit("addMessage", { chat: result });
      }
    });

    res.status(200).json({ chat: result });
  } catch (error) {
    next(error);
  }
};

exports.addAdmin = async (req, res, next) => {
  const userId = req.userId;
  const { chatId, adminId } = req.body;

  console.log(req.body);
  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [userId] },
    }).populate([
      {
        path: "users",
        select: "username fullname profileImage.url",
      },
      {
        path: "messages.sender",
        select: "username fullname profileImage.url",
      },
    ]);

    if (!chat || !chat.group) {
      const error = new Error("Chat no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const admin = await User.findById(adminId);

    chat.group.admins.push(admin._id);
    const result = await chat.save();

    console.log(result);

    chat.users.forEach((receiver) => {
      if (receiver._id.toString() !== userId) {
        getIO()
          .to(receiver._id.toString())
          .emit("addMessage", { chat: result });
      }
    });

    res.status(200).json({ chat: result });
  } catch (error) {
    next(error);
  }
};

exports.removeAdmin = async (req, res, next) => {
  const userId = req.userId;
  const { chatId, adminId } = req.body;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [userId] },
    }).populate([
      {
        path: "users",
        select: "username fullname profileImage.url",
      },
      {
        path: "messages.sender",
        select: "username fullname profileImage.url",
      },
    ]);

    if (!chat || !chat.group) {
      const error = new Error("Chat no encontrado");
      error.statusCode = 404;
      throw error;
    }

    chat.group.admins.pull(adminId);
    const result = await chat.save();

    chat.users.forEach((receiver) => {
      if (receiver._id.toString() !== userId) {
        getIO()
          .to(receiver._id.toString())
          .emit("addMessage", { chat: result });
      }
    });

    res.status(200).json({ chat: result });
  } catch (error) {
    next(error);
  }
};

exports.leaveGroup = async (req, res, next) => {
  const userId = req.userId;
  const { chatId } = req.body;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [userId] },
    }).populate([
      {
        path: "users",
        select: "username fullname profileImage.url",
      },
      {
        path: "messages.sender",
        select: "username fullname profileImage.url",
      },
    ]);

    if (!chat || !chat.group) {
      const error = new Error("Chat no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const senderData = chat.users.find((u) => u._id.toString() === userId);
    chat.messages.push({
      sender: senderData,
      text: `@${senderData.username} abandonó el grupo`,
      global: true,
    });

    chat.users.pull(userId);
    // console.log(chat.group.admins);
    // console.log(chat.users);
    chat.group.admins.pull(userId);
    const result = await chat.save();

    chat.users.forEach((receiver) => {
      if (receiver._id.toString() !== userId) {
        getIO()
          .to(receiver._id.toString())
          .emit("addMessage", { chat: result });
      }
    });

    res.status(200).json({ chat: result });
  } catch (error) {
    next(error);
  }
};
