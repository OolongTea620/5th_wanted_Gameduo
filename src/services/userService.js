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
    console.log(newUser, newUser.id);

    const [incrReulst, addRankResult, userAddReult] = await redisCli
      .multi()
      .zAdd("rankScore", { score: 0, value: `${newUser.id}` })
      .exec();

    await sequelizeTransaction.commit();
    return { userId: newUser.id };
  } catch (err) {
    sequelizeTransaction.rollback();
  }
};

const getUserInfoById = async (userId) => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new error("NotFound User", 404);
  }
  const raidRecords = await RaidRecord.findAll(
    {
      attributes: [["id", "raidRecordId"], "enterTime", "endTime", "score"],
    },
    {
      userId: userId,
    }
  );
  console.log(user, raidRecords);
  return {
    totalScore: user.totalScore,
    bossRaidHistory: raidRecords,
  };
};

module.exports = { createUser, getUserInfoById };
