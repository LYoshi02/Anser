const User = require("../models/User");

exports.getUsers = async (req, res, next) => {
  const userId = req.userId;
  const searchedUser = req.query.search;

  try {
    let findQuery = { _id: { $not: { $eq: userId } } };
    if (searchedUser) {
      findQuery = {
        ...findQuery,
        fullname: new RegExp(searchedUser, "i"),
      };
    }

    const users = await User.find(findQuery)
      .select("_id username fullname profileImage.url")
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
    }).select("_id username fullname description profileImage.url");

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

exports.updateUser = async (req, res, next) => {
  const userId = req.userId;
  const username = req.params.username;

  try {
    const user = await User.findOne({ _id: userId, username });

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const { fullname, description } = req.body;
    user.fullname = fullname;
    user.description = description;
    await user.save();

    res.status(200).json({ user: { fullname, description } });
  } catch (error) {
    next(error);
  }
};
