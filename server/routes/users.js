const express = require("express");

const isAuth = require("../middleware/is-auth");
const usersController = require("../controllers/users");

const routes = express.Router();

routes.get("/", isAuth, usersController.getUsers);

routes.get("/:username", isAuth, usersController.getUser);

routes.post("/:username", isAuth, usersController.updateUser);

module.exports = routes;
