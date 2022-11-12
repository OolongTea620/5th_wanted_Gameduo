const User = require("../models/user");
const error = require("../middlewares/errorConstructor");

const create = async () => {
  const newUser = await User.create();
  return { userId: newUser.userId };
};

const getUserInfo = async () => {};
module.exports = {
  create,
};
