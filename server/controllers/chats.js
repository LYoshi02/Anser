const Chat = require("../models/Chat");
const User = require("../models/User");
const { getIO } = require("../socket");

exports.createNewChat = async (req, res, next) => {
  const userId = req.userId;
  const { receiver, text } = req.body.chatData;

  try {
    const users = await User.find({ _id: { $in: [userId, receiver] } });
    const usersFormatted = users.map(({ _id, username, fullname }) => {
      return { _id, username, fullname };
    });

    const newChat = new Chat({
      users,
      messages: [
        {
          sender: userId,
          text: text,
        },
      ],
    });

    await newChat.save();

    for await (let user of users) {
      user.chats.push(newChat._id);
      await user.save();
    }

    const responseChat = {
      _id: newChat._id,
      messages: newChat.messages,
      users: usersFormatted,
    };
    getIO().to(receiver).emit("newChat", { chat: responseChat });

    res.status(201).json({ chat: responseChat });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.addMessage = async (req, res, next) => {
  const userId = req.userId;
  const { receiver, text, chatId } = req.body.chatData;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [userId, receiver] },
    }).populate({
      path: "users",
      select: "username fullname",
    });

    if (!chat) {
      const error = new Error("Chat no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const newMessage = {
      sender: userId,
      text,
    };
    chat.messages.push(newMessage);
    const result = await chat.save();

    getIO().to(receiver).emit("addMessage", { chat: result });
    res.status(200).json({ chat: result });
  } catch (error) {
    next(error);
  }
};
