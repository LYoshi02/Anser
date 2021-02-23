const Chat = require("../models/Chat");

module.exports = async (req, res, next) => {
  const userId = req.userId;
  const { chatId } = req.body;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [userId] },
    });

    if (!chat && !chat.group) {
      const error = new Error("Chat no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const isUserAdmin = chat.group.admins.some(
      (admin) => admin.toString() === userId
    );
    if (isUserAdmin) {
      return next();
    } else {
      const error = new Error(
        "Solo los administradores pueden realizar esta acción"
      );
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
