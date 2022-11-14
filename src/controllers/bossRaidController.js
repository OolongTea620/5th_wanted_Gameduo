const raidRecordService = require("../services/raidRecordService");

const getStatus = async (req, res) => {
  const result = await raidRecordService.checkBossRaid();
  res.status(200).json(result);
};

const raidStart = async (req, res) => {
  const result = await raidRecordService.enterRaid(req);
  res.status(201).json(result);
};

const raidEnd = async (req, res) => {
  const result = await raidRecordService.endRaid(req);

  if (!result) {
    throw new error("Server Error", 500);
  }
  res.status(200).json({});
};

module.exports = { getStatus, raidStart, raidEnd };
