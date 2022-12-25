const raidRecordService = require("../services/raidRecordService");

const getStatus = async (req, res) => {
  const result = await raidRecordService.checkBossRaid();
  res.status(200).json(result);
};

const raidStart = async (req, res) => {
  const { userId, level } = req.body;
  const result = await raidRecordService.startBossRaid(userId, level);
  res.status(201).json(result);
};

const raidEnd = async (req, res) => {
  const result = await raidRecordService.endRaid(req);

  if (!result) {
    throw new error("Server Error", 500);
  }
  res.status(200).json({});
};

const getTopRanckerList = async (req, res) => {
  const result = await userService.rankScoreByuserId(req);
  res.status(200).json(result);
};

module.exports = { getStatus, raidStart, raidEnd, getTopRanckerList };
