const express = require("express");

const isAuth = require("../middleware/is-auth");
const groupController = require("../controllers/group");

const router = express.Router();

router.post("/add-members", isAuth, groupController.addMembers);

module.exports = router;
