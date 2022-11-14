const sequelize = require("sequelize");

const User = require("../models/user");
const raidRecordService = require("../services/raidRecordService");

const error = require("../middlewares/errorConstructor");

const create = async () => {
  const newUser = await User.create();
  return { userId: newUser.userId };
};

const getUserInfo = async (userId) => {
  const totalScore = await User.findOne({ where: { userId } }).totalScore;
  const raidRecords = await raidRecordService.getRecordsByuserId(userId);
  return {
    totalScore,
    bossRaidHistory: raidRecords,
  };
};

const rankScoreByuserId = async (req) => {
  const { userId } = req.body;
  const rankList = await User.findAll({
    attributes: [
      "userId",
      "totalScore",
      [
        sequelize.literal("rank() over(order by totalScore desc)- 1"),
        "ranking",
      ],
    ],
  });

  const userRank = rankList.reduce((acc, obj) => {
    if (obj.userId === userId) {
      acc = obj;
    }
    return acc;
  }, {});

  return { topRankerInfoList: rankList, myRankingInfo: userRank };
};

module.exports = {
  create,
  getUserInfo,
  rankScoreByuserId,
};
