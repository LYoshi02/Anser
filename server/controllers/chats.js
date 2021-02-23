const Chat = require("../models/Chat");
const User = require("../models/User");
const { getIO } = require("../socket");

exports.createNewChat = async (req, res, next) => {
  const userId = req.userId;
  const { receivers, text, groupName } = req.body.chatData;

  try {
    const users = await User.find({ _id: { $in: [userId, ...receivers] } });
    const usersFormatted = users.map(
      ({ _id, username, fullname, profileImage }) => {
        return {
          _id,
          username,
          fullname,
          profileImage: { url: profileImage.url },
        };
      }
    );

    const senderData = users.find((u) => u._id.toString() === userId);
    let newChatProperties = { users };
    if (groupName) {
      newChatProperties = {
        ...newChatProperties,
        messages: [
          {
            sender: senderData,
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
            text: text,
          },
        ],
      };
    }

    console.log(newChatProperties);
    const newChat = new Chat({ ...newChatProperties });
    await newChat.save();

    for await (let user of users) {
      user.chats.push(newChat._id);
      await user.save();
    }

    console.log(newChat);

    const responseChat = {
      _id: newChat._id,
      messages: newChat.messages,
      users: usersFormatted,
      updatedAt: newChat.updatedAt,
      group: groupName && newChat.group,
    };

    usersFormatted.forEach((user) => {
      if (user._id.toString() !== userId) {
        getIO().to(user._id.toString()).emit("newChat", { chat: responseChat });
      }
    });

    res.status(201).json({ chat: responseChat });
  } catch (error) {
    next(error);
  }
};

exports.addMessage = async (req, res, next) => {
  const userId = req.userId;
  const { receivers, text, chatId } = req.body.chatData;

  console.log(req.body);
  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [userId, ...receivers] },
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
    const newMessage = {
      sender: senderData,
      text,
    };
    chat.messages.push(newMessage);
    const result = await chat.save();

    receivers.forEach((receiver) => {
      if (receiver !== userId) {
        getIO().to(receiver).emit("addMessage", { chat: result });
      }
    });

    res.status(200).json({ chat: result });
  } catch (error) {
    next(error);
  }
};
