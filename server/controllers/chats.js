const Chat = require("../models/Chat");
const User = require("../models/User");
const { getIO } = require("../socket");

exports.createNewChat = async (req, res, next) => {
  const userId = req.userId;
  const { receivers, text } = req.body.chatData;

  try {
    const users = await User.find({ _id: { $in: [userId, ...receivers] } });
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

    usersFormatted.forEach((user) => {
      if (user._id.toString() !== userId) {
        getIO().to(user._id.toString()).emit("newChat", { chat: responseChat });
      }
    });

    res.status(201).json({ chat: responseChat });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.addMessage = async (req, res, next) => {
  const userId = req.userId;
  const { receivers, text, chatId } = req.body.chatData;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [userId, ...receivers] },
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

    receivers.forEach((receiver) => {
      if (receiver !== userId) {
        getIO().to(receiver).emit("addMessage", { chat: result });
      }
    });

    res.status(200).json({ chat: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createNewGroup = async (req, res, next) => {
  const userId = req.userId;
  const { membersId, name } = req.body.groupData;

  try {
    const members = await User.find({ _id: { $in: [userId, ...membersId] } });

    const groupCreator = members.find((u) => u._id.toString() === userId);
    const newChat = new Chat({
      users: members,
      messages: [
        {
          sender: userId,
          text: `@${groupCreator.username} ha creado el grupo`,
          global: true,
        },
      ],
      group: {
        creator: userId,
        name: name,
      },
    });

    await newChat.save();

    for await (let member of members) {
      member.chats.push(newChat._id);
      await member.save();
    }

    const membersFormatted = members.map(({ _id, username, fullname }) => {
      return { _id, username, fullname };
    });
    const responseChat = {
      _id: newChat._id,
      messages: newChat.messages,
      users: membersFormatted,
      group: newChat.group,
    };

    membersFormatted.forEach((member) => {
      if (member._id.toString() !== userId) {
        getIO()
          .to(member._id.toString())
          .emit("newChat", { chat: responseChat });
      }
    });

    res.status(201).json({ chat: responseChat });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
