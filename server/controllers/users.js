const User = require("../models/User");

exports.getUsers = async (req, res, next) => {
  const userId = req.userId;

  try {
    const users = await User.find({ _id: { $not: { $eq: userId } } })
      .select("_id username fullname")
      .sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  const userId = req.userId;
  const username = req.params.username;

  try {
    const user = await User.findOne({
      _id: { $not: { $eq: userId } },
      username,
    }).select("_id username fullname");

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
