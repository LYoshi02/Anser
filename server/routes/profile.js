const express = require("express");

const isAuth = require("../middleware/is-auth");
const uploadImageToCloud = require("../middleware/upload-image");
const profileController = require("../controllers/profile");

const router = express.Router();

router.post(
  "/image",
  isAuth,
  uploadImageToCloud,
  profileController.saveImageUrl
);

router.delete("/image", isAuth, profileController.deleteProfileImage);

module.exports = router;
