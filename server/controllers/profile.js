const User = require("../models/User");
const { deleteBucketFile } = require("../util/file");

exports.saveImageUrl = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (user.profileImage.filename) {
      await deleteBucketFile(user.profileImage.filename);
    }

    const { filename, url } = req.image;
    user.profileImage = { filename, url };
    await user.save();

    res.status(200).json({ profileImage: { url } });
  } catch (error) {
    next(error);
  }
};

exports.deleteProfileImage = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (user.profileImage.filename) {
      await deleteBucketFile(user.profileImage.filename);
    }

    user.profileImage = null;
    await user.save();

    res.status(200).json({ messsage: "Imagen borrada correctamente" });
  } catch (error) {
    next(error);
  }
};
