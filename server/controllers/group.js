const { validationResult } = require("express-validator");

const Chat = require("../models/Chat");
const User = require("../models/User");
const { filterUserMessages } = require("../util/chat");
const { deleteBucketFile } = require("../util/file");
const { getIO } = require("../socket");

exports.addMembers = async (req, res, next) => {
  const userId = req.userId;
  const chatId = req.params.chatId;
  const { newMembers } = req.body;

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

    const participants = [...chat.users, ...newMembers];
    const prevUsers = [...chat.users];
    const newMembersData = await User.find({
      _id: { $in: [...newMembers] },
    }).select("username fullname profileImage.url");
    const senderData = chat.users.find((u) => u._id.toString() === userId);

    await User.updateMany(
      {
        _id: { $in: [...newMembers] },
      },
      {
        $addToSet: { chats: chat._id }, // To prevent pushing duplicated chats
      }
    );

    const addMembersMessages = [];
    newMembersData.forEach((member) => {
      addMembersMessages.push({
        sender: senderData,
        text: `@${senderData.username} ha añadido a @${member.username}`,
        global: true,
        participants,
      });
    });

    chat.users.push(...newMembersData);
    chat.messages.push(...addMembersMessages);
    await chat.save();

    const chatObj = chat.toObject();
    newMembersData.forEach((member) => {
      const memberId = member._id.toString();
      const filteredMessages = filterUserMessages(chatObj.messages, memberId);

      getIO()
        .to(memberId)
        .emit("newGroupChat", {
          chat: {
            ...chatObj,
            messages: filteredMessages,
          },
        });
    });

    const newMessagesPushed = chat.messages.slice(
      addMembersMessages.length * -1
    );
    prevUsers.forEach((receiver) => {
      if (receiver._id.toString() !== userId) {
        getIO()
          .to(receiver._id.toString())
          .emit("updateChat", {
            chatId,
            updatedProperties: {
              users: chat.users,
              messages: newMessagesPushed,
            },
          });
      }
    });

    res.status(200).json({
      users: chat.users,
      messages: newMessagesPushed,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  const userId = req.userId;
  const chatId = req.params.chatId;
  const { userChangedId } = req.body;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [userId] },
    }).populate({
      path: "users",
      select: "username fullname profileImage.url",
    });

    if (!chat || !chat.group) {
      const error = new Error("Chat no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const senderData = chat.users.find((u) => u._id.toString() === userId);
    const removedMember = chat.users.find(
      (u) => u._id.toString() === userChangedId
    );
    const previousUsers = [...chat.users];

    chat.messages.push({
      sender: senderData,
      text: `@${senderData.username} ha eliminado a @${removedMember.username}`,
      global: true,
      participants: chat.users,
    });
    chat.users.pull(userChangedId);
    chat.group.admins.pull(userChangedId);
    await chat.save();

    const newMessagePushed = chat.messages.slice(-1);
    previousUsers.forEach((receiver) => {
      if (receiver._id.toString() !== userId) {
        getIO()
          .to(receiver._id.toString())
          .emit("updateChat", {
            chatId,
            updatedProperties: {
              users: chat.users,
              messages: newMessagePushed,
              group: chat.group,
            },
          });
      }
    });

    res.status(200).json({
      users: chat.users,
      messages: newMessagePushed,
      group: chat.group,
    });
  } catch (error) {
    next(error);
  }
};

exports.addAdmin = async (req, res, next) => {
  const userId = req.userId;
  const chatId = req.params.chatId;
  const { userChangedId } = req.body;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [userId] },
    });

    if (!chat || !chat.group) {
      const error = new Error("Chat no encontrado");
      error.statusCode = 404;
      throw error;
    }

    chat.group.admins.push(userChangedId);
    await chat.save();

    chat.users.forEach((receiver) => {
      const receiverId = receiver._id.toString();
      if (receiverId !== userId) {
        getIO()
          .to(receiverId)
          .emit("updateChat", {
            chatId,
            updatedProperties: { group: chat.group },
          });
      }
    });

    res.status(200).json({ group: chat.group });
  } catch (error) {
    next(error);
  }
};

exports.removeAdmin = async (req, res, next) => {
  const userId = req.userId;
  const chatId = req.params.chatId;
  const { userChangedId } = req.body;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [userId] },
    });

    if (!chat || !chat.group) {
      const error = new Error("Chat no encontrado");
      error.statusCode = 404;
      throw error;
    }

    chat.group.admins.pull(userChangedId);
    await chat.save();

    chat.users.forEach((receiver) => {
      const receiverId = receiver._id.toString();
      if (receiverId !== userId) {
        getIO()
          .to(receiverId)
          .emit("updateChat", {
            chatId,
            updatedProperties: { group: chat.group },
          });
      }
    });

    res.status(200).json({ group: chat.group });
  } catch (error) {
    next(error);
  }
};

exports.leaveGroup = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 422;
      throw error;
    }

    const userId = req.userId;
    const chatId = req.params.chatId;
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [userId] },
    }).populate({
      path: "users",
      select: "username fullname profileImage.url",
    });

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
      participants: chat.users,
    });
    chat.users.pull(userId);
    chat.group.admins.pull(userId);
    await chat.save();

    const newMessagePushed = chat.messages.slice(-1);
    chat.users.forEach((receiver) => {
      const receiverId = receiver._id.toString();
      if (receiverId !== userId) {
        getIO()
          .to(receiverId)
          .emit("updateChat", {
            chatId,
            updatedProperties: {
              users: chat.users,
              group: chat.group,
              messages: newMessagePushed,
            },
          });
      }
    });

    res.status(200).json({
      users: chat.users,
      group: chat.group,
      messages: newMessagePushed,
    });
  } catch (error) {
    next(error);
  }
};

exports.setImage = async (req, res, next) => {
  const userId = req.userId;
  const chatId = req.params.chatId;

  try {
    const chat = await Chat.findOne({ _id: chatId, users: { $in: userId } });

    if (!chat || !chat.group) {
      const error = new Error("Chat no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (chat.group.image.filename) {
      await deleteBucketFile(chat.group.image.filename);
    }

    const { filename, url } = req.image;
    chat.group.image = { filename, url };
    await chat.save();

    chat.users.forEach((receiver) => {
      const receiverId = receiver._id.toString();
      if (receiverId !== userId) {
        getIO()
          .to(receiverId)
          .emit("updateChat", {
            chatId,
            updatedProperties: { group: chat.group },
          });
      }
    });

    res.status(200).json({ group: chat.group });
  } catch (error) {
    next(error);
  }
};

exports.deleteImage = async (req, res, next) => {
  const userId = req.userId;
  const chatId = req.params.chatId;

  try {
    const chat = await Chat.findOne({ _id: chatId, users: { $in: userId } });

    if (!chat || !chat.group) {
      const error = new Error("Chat no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (chat.group.image.filename) {
      await deleteBucketFile(chat.group.image.filename);
    }

    chat.group.image = null;
    await chat.save();

    chat.users.forEach((receiver) => {
      const receiverId = receiver._id.toString();
      if (receiverId !== userId) {
        getIO()
          .to(receiverId)
          .emit("updateChat", {
            chatId,
            updatedProperties: { group: chat.group },
          });
      }
    });

    res.status(200).json({ group: chat.group });
  } catch (error) {
    next(error);
  }
};
