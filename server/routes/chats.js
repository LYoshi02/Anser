const express = require("express");

const isAuth = require("../middleware/is-auth");
const chatsController = require("../controllers/chats");

const router = express.Router();

router.post("/new", isAuth, chatsController.createNewChat);
router.put("/add-message", isAuth);

module.exports = router;
