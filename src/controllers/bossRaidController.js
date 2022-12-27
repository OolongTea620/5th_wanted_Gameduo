const raidService = require("../services/raidService");
const raidRecordService = require("../services/raidRecordService");

const getStatus = async (req, res) => {
  const result = await raidService.getBossRaidStatus();

  res.status(200).json(result);
};

const raidStart = async (req, res) => {
  const { userId, level } = req.body;
  const result = await raidService.startBossRaid(userId, level);
  if (result.isEntered) {
    res.status(201).json(result);
  }
  res.status(200).json(result);
};

const raidEnd = async (req, res) => {
  const { userId, raidRecordId } = req.body;
  const result = await raidService.endBossRaid(userId, raidRecordId);

  if (!result) {
    throw new error("Server Error", 500);
  }
  res.status(200).json({});
};

const getTopRanckerList = async (req, res) => {
  const { userId } = req.body;
  const result = await raidRecordService.getRankingListByuserId(userId);
  res.status(200).json(result);
};

module.exports = { getStatus, raidStart, raidEnd, getTopRanckerList };
