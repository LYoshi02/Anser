const express = require("express");
const { param, body } = require("express-validator");

const Chat = require("../models/Chat");
const isAuth = require("../middleware/is-auth");
const uploadImageToCloud = require("../middleware/upload-image");
const isAdmin = require("../middleware/is-admin");
const groupController = require("../controllers/group");

const router = express.Router();

router.post(
  "/:chatId/add-members",
  isAuth,
  isAdmin,
  body("newMembers").custom((value) => {
    if (!Array.isArray(value) || !value.length) {
      throw new Error("La lista de miembros a añadir se encuentra vacía.");
    }

    return true;
  }),
  groupController.addMembers
);

router.post(
  "/:chatId/remove-member",
  isAuth,
  isAdmin,
  groupController.removeMember
);

router.post("/:chatId/add-admin", isAuth, isAdmin, groupController.addAdmin);

router.post(
  "/:chatId/remove-admin",
  isAuth,
  isAdmin,
  groupController.removeAdmin
);

router.post(
  "/:chatId/leave",
  isAuth,
  param("chatId").custom(async (value, { req }) => {
    const userId = req.userId;
    const chat = await Chat.findOne({ _id: value, users: { $in: userId } });

    if (!chat || !chat.group) {
      throw new Error("Chat no encontrado");
    }

    const remainingAdmins = chat.group.admins.filter(
      (a) => a._id.toString() !== userId
    );

    if (remainingAdmins.length === 0) {
      throw new Error("Debe quedar al menos 1 administrador en el grupo");
    }

    return true;
  }),
  groupController.leaveGroup
);

router.post(
  "/:chatId/image",
  isAuth,
  uploadImageToCloud,
  groupController.setImage
);

router.delete("/:chatId/image", isAuth, groupController.deleteImage);

router.post(
  "/:chatId/name",
  isAuth,
  body("name")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("El nombre debe tener entre 3 y 30 caracteres"),
  groupController.changeName
);

module.exports = router;
