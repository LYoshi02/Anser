const { v4: uuid } = require("uuid");

const bucket = require("../firebaseStorage");

module.exports = async (req, res, next) => {
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
    req.image = {
      filename: req.file.filename,
      url: fileUrl,
    };
    next();
  } catch (error) {
    next(error);
  }
};
