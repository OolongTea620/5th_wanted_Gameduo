const userService = require("../services/userService");
const error = require("../middlewares/errorConstructor");

const signup = async (req, res) => {
  const userCreateResult = await userService.create();

  if (!userCreateResult) {
    throw error("ServerError", 500);
  }
  res.status(201).json(userCreateResult);
};

const getUserInfo = async (req, res) => {};
module.exports = { signup };
