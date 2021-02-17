const express = require("express");
const multer = require("multer");
const { v4: uuid } = require("uuid");

const isAuth = require("../middleware/is-auth");
const profileController = require("../controllers/profile");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    cb(null, uuid());
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    return cb(null, true);
  }

  return cb(null, false);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Megabytes
  },
});

router.post(
  "/image",
  isAuth,
  upload.single("profileImg"),
  profileController.uploadProfileImage,
  profileController.saveImageUrl
);

router.delete("/image", isAuth, profileController.deleteProfileImage);

module.exports = router;
