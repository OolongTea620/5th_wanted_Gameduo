const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const userController = require("../controllers/userController");

router.get("/:userId(\\d+)", errorHandler(userController.getUserInfo));
router.post("", errorHandler(userController.signup));

module.exports = router;
