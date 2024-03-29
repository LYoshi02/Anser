const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const { filterUserMessages } = require("../util/chat");
const User = require("../models/User");

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body.userData;

  try {
    const userExists = await User.findOne({ email })
      .populate([
        {
          path: "chats",
          populate: {
            path: "users",
            model: "User",
            select: "username fullname profileImage.url",
          },
        },
        {
          path: "chats",
          populate: {
            path: "messages.sender",
            model: "User",
            select: "username fullname profileImage.url",
          },
          options: { sort: { updatedAt: -1 } },
        },
      ])
      .exec();

    if (!userExists) {
      const error = new Error(
        "El email o la contraseña ingresados no son válidos"
      );
      error.statusCode = 401;
      throw error;
    }

    const passwordsMatch = bcrypt.compare(password, userExists.password);
    if (!passwordsMatch) {
      const error = new Error(
        "El email o la contraseña ingresados no son válidos"
      );
      error.statusCode = 401;
      throw error;
    }

    const userObj = userExists.toObject();
    const chatsMessagesFiltered = userObj.chats.map((chat) => {
      const messagesFiltered = filterUserMessages(
        chat.messages,
        userExists._id.toString()
      );

      return {
        ...chat,
        messages: messagesFiltered,
      };
    });

    const userData = {
      ...userObj,
      chats: chatsMessagesFiltered,
      userId: userObj._id,
    };
    const accessToken = generateAcessToken({ userId: userData.userId });

    res.status(200).json({ user: userData, token: accessToken });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Los campos ingresados no son válidos");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { email, fullname, username, password } = req.body.userData;
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      const message =
        userExists.username === username
          ? "El nombre de usuario ingresado ya existe"
          : "El correo ingresado ya se encuentra en uso";
      const error = new Error(message);
      error.statusCode = 401;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      fullname,
      username,
      password: hashedPassword,
    });

    await user.save();

    const userData = {
      ...user.toObject(),
      userId: user._id,
    };
    const accessToken = generateAcessToken({ userId: userData.userId });

    res.status(201).json({ user: userData, token: accessToken });
  } catch (error) {
    next(error);
  }
};

exports.getUserData = (req, res, next) => {
  const token = req.body.token;

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        const error = new Error("El token no es válido");
        error.statusCode = 403;
        throw error;
      }

      const userFound = await User.findById(user.userId)
        .select("_id username fullname email chats description profileImage")
        .populate([
          {
            path: "chats",
            populate: {
              path: "users",
              model: "User",
              select: "username fullname profileImage.url",
            },
            options: { sort: { updatedAt: -1 } },
          },
          {
            path: "chats",
            populate: {
              path: "messages.sender",
              model: "User",
              select: "username fullname profileImage.url",
            },
            options: { sort: { updatedAt: -1 } },
          },
        ])
        .exec();

      const userObj = userFound.toObject();
      const chatsMessagesFiltered = userObj.chats.map((chat) => {
        const messagesFiltered = filterUserMessages(chat.messages, user.userId);

        return {
          ...chat,
          messages: messagesFiltered,
        };
      });

      res.status(200).json({
        user: {
          ...userObj,
          chats: chatsMessagesFiltered,
          userId: userObj._id,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

const generateAcessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
};
