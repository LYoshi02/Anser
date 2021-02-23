const express = require("express");

const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");
const groupController = require("../controllers/group");

const router = express.Router();

router.post("/add-members", isAuth, isAdmin, groupController.addMembers);

router.post("/remove-member", isAuth, isAdmin, groupController.removeMember);

router.post("/add-admin", isAuth, isAdmin, groupController.addAdmin);

router.post("/remove-admin", isAuth, isAdmin, groupController.removeAdmin);

router.post("/leave", isAuth, groupController.leaveGroup);

module.exports = router;
