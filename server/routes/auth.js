const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.post("/login", authController.loginUser);
router.put(
  "/signup",
  [
    body("userData.email")
      .isEmail()
      .withMessage("El email no es válido")
      .normalizeEmail(),
    body("userData.fullname")
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("El nombre debe tener entre 3 y 30 caracteres"),
    body("userData.username")
      .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, "gim")
      .withMessage("El nombre de usuario no es válido")
      .trim()
      .toLowerCase(),
    body("userData.password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  authController.createUser
);
router.post("/user", authController.getUserData);

module.exports = router;
