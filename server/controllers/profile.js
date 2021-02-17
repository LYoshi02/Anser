const { v4: uuid } = require("uuid");

const User = require("../models/User");
const bucket = require("../firebaseStorage");
const { deleteBucketFile } = require("../util/file");

exports.uploadProfileImage = async (req, res, next) => {
  const filePath = `upload/${req.file.filename}`;
  const downloadToken = uuid();
  const metadata = {
    metadata: {
      // This line is very important. It's to create a download token.
      firebaseStorageDownloadTokens: downloadToken,
    },
    contentType: req.file.mimetype,
    cacheControl: "public, max-age=31536000",
  };

  try {
    // Uploads a local file to the bucket
    await bucket.upload(filePath, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      metadata: metadata,
    });

    const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET_NAME}/o/${req.file.filename}?alt=media&token=${downloadToken}`;
    req.profileImage = {
      filename: req.file.filename,
      url: fileUrl,
    };
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

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

    const { filename, url } = req.profileImage;
    user.profileImage = { filename, url };
    await user.save();

    res.status(200).json({ profileImage: url });
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
