const { sequelize } = require("../models");

const User = require("../models/user");
const RaidRecord = require("../models/raidRecord");
const { redisCli } = require("../cache");
const error = require("../middlewares/errorConstructor");

const createUser = async () => {
  try {
    const sequelizeTransaction = await sequelize.transaction();
    const newUser = await User.create(
      {},
      { transaction: sequelizeTransaction }
    );

    const [incrReulst, addRankResult, userAddReult] = await redisCli
      .multi()
      .zAdd("rank", { score: 0, value: `${newUser.id}` })
      .exec();
    await sequelizeTransaction.commit();
    return { userId: newUser.id };
  } catch (err) {
    sequelizeTransaction.rollback();
  }
};

const getUserInfoById = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    throw new error("NotFound User", 404);
  }
  const raidRecords = await RaidRecord.findAll({
    attributes: [["id", "raidRecordId"], "enterTime", "endTime", "score"],
    where: { userId: userId },
  });
  return {
    totalScore: user.totalScore,
    bossRaidHistory: raidRecords,
  };
};

module.exports = { createUser, getUserInfoById };
