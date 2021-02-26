const Chat = require("../models/Chat");
const User = require("../models/User");
const { getIO } = require("../socket");

exports.createNewChat = async (req, res, next) => {
  const userId = req.userId;
  const { receivers, text, groupName } = req.body.chatData;

  try {
    const chatUsersIds = [userId, ...receivers];
    const users = await User.find({ _id: { $in: chatUsersIds } }).select(
      "username fullname profileImage.url"
    );

    const senderData = users.find((u) => u._id.toString() === userId);
    let newChatProperties = { users };
    if (groupName) {
      newChatProperties = {
        ...newChatProperties,
        messages: [
          {
            sender: senderData,
            participants: chatUsersIds,
            text: `@${senderData.username} ha creado el grupo`,
            global: true,
          },
        ],
        group: {
          creator: senderData._id,
          name: groupName,
          admins: [senderData._id],
        },
      };
    } else {
      newChatProperties = {
        ...newChatProperties,
        messages: [
          {
            sender: senderData,
            participants: chatUsersIds,
            text: text,
          },
        ],
      };
    }

    const newChat = new Chat({ ...newChatProperties });
    await newChat.save();

    await User.updateMany(
      {
        _id: { $in: chatUsersIds },
      },
      {
        $addToSet: { chats: newChat._id }, // To prevent pushing duplicated chats
      }
    );

    users.forEach((user) => {
      if (user._id.toString() !== userId) {
        getIO().to(user._id.toString()).emit("newChat", { chat: newChat });
      }
    });

    res.status(201).json({ chat: newChat });
  } catch (error) {
    next(error);
  }
};

exports.addMessage = async (req, res, next) => {
  const userId = req.userId;
  const { receivers, text, chatId } = req.body.chatData;

  try {
    const participants = [userId, ...receivers];
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $all: participants },
    });

    if (!chat) {
      const error = new Error("Chat no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const senderData = await User.findById(userId).select(
      "username fullname profileImage.url"
    );
    const newMessage = {
      sender: senderData,
      participants,
      text,
    };
    chat.messages.push(newMessage);
    await chat.save();

    const lastMessage = chat.messages[chat.messages.length - 1];
    receivers.forEach((receiver) => {
      if (receiver !== userId) {
        getIO().to(receiver).emit("addMessage", {
          chatId: chatId,
          message: lastMessage,
        });
      }
    });

    res.status(200).json({ message: lastMessage });
  } catch (error) {
    next(error);
  }
};
