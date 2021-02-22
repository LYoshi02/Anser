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

    const newMembersData = await User.find({
      _id: { $in: [...newMembers] },
    });
    for await (let member of newMembersData) {
      member.chats.push(chat._id);
      await member.save();
    }

    const senderData = chat.users.find((u) => u._id.toString() === userId);
    const previousUsers = [...chat.users];
    chat.users.push(...newMembers);
    chat.messages.push({
      sender: senderData,
      text: `@${senderData.username} ha añadido a nuevos miembros`,
      global: true,
    });

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
