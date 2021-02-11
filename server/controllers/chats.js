const Chat = require("../models/Chat");
const User = require("../models/User");

exports.createNewChat = async (req, res, next) => {
  const userId = req.userId;
  const { receiver, text } = req.body.chatData;

  try {
    const users = await User.find({ _id: { $in: [userId, receiver] } });
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

    res.status(201).json({ chat: newChat });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
