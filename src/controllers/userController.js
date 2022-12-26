const userService = require("../services/userService");
const error = require("../middlewares/errorConstructor");

const signup = async (req, res) => {
  const userCreateResult = await userService.createUser();

  if (!userCreateResult) {
    throw error("ServerError", 500);
  }
  res.status(201).json(userCreateResult);
};

const getUserInfo = async (req, res) => {
  const { userId } = req.params;
  const userInfo = await userService.getUserInfoById(userId);
  res.status(200).json(userInfo);
};

module.exports = { signup, getUserInfo };
