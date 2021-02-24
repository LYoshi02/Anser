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
        $addToSet: { chats: chat._id }, // To prevent push duplicated chats
      }
    );

    const addMembersMessages = [];
    newMembersData.forEach((member) => {
      addMembersMessages.push({
        sender: senderData,
        text: `@${senderData.username} ha añadido a @${member.username}`,
        global: true,
      });
    });

    chat.users.push(...newMembersData);
    chat.messages.push(...addMembersMessages);
    await chat.save();

    newMembersData.forEach((member) => {
      getIO().to(member._id.toString()).emit("newChat", {
        chat,
      });
    });

    prevUsers.forEach((receiver) => {
      if (receiver._id.toString() !== userId) {
        getIO()
          .to(receiver._id.toString())
          .emit("updateChat", {
            chatId,
            updatedProperties: {
              users: chat.users,
              messages: chat.messages,
            },
          });
      }
    });

    res.status(200).json({
      users: chat.users,
      messages: addMembersMessages,
    });
  } catch (error) {
    next(error);
  }
};

// TODO: remove from users and from admins
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
    const removedMemberMessage = {
      sender: senderData,
      text: `@${senderData.username} ha eliminado a @${removedMember.username}`,
      global: true,
    };
    const previousUsers = [...chat.users];

    chat.messages.push(removedMemberMessage);
    chat.users.pull(memberId);
    chat.group.admins.pull(memberId);
    await chat.save();

    previousUsers.forEach((receiver) => {
      if (receiver._id.toString() !== userId) {
        getIO()
          .to(receiver._id.toString())
          .emit("updateChat", {
            chatId,
            updatedProperties: {
              users: chat.users,
              messages: chat.messages,
            },
          });
      }
    });

    res.status(200).json({ users: chat.users, messages: chat.messages });
  } catch (error) {
    next(error);
  }
};

exports.addAdmin = async (req, res, next) => {
  const userId = req.userId;
  const { chatId, adminId } = req.body;

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

    chat.group.admins.push(adminId);
    await chat.save();

    chat.users.forEach((receiver) => {
      if (receiver._id.toString() !== userId) {
        getIO()
          .to(receiver._id.toString())
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
  const { chatId, adminId } = req.body;

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

    chat.group.admins.pull(adminId);
    await chat.save();

    chat.users.forEach((receiver) => {
      if (receiver._id.toString() !== userId) {
        getIO()
          .to(receiver._id.toString())
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
