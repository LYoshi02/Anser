const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.post("/login", authController.loginUser);
router.put("/signup", authController.createUser);
router.post("/user", authController.getUserData);

module.exports = router;
