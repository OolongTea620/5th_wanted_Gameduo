const { redisClient } = require("../cache");
const redis = redisClient.v4;
const error = require("../middlewares/errorConstructor");

const getBossRaidStatus = async () => {
  try {
    let raidStatus = { canEnter: true };

    // const bossRaidNow = await redis.sendCommand(["EXISTS", "bossRaid"]);
    const bossRaid = await redis.sendCommand(["HGETALL", "bossRaid"]);
    if (bossRaid.length === 0) {
      return raidStatus;
    }
    raidStatus.enterdUserId = Number(bossRaid.userId);
    raidStatus.canEnter = false;
    return raidStatus;
  } catch (err) {
    console.log(err);
    //throw new error(err.message, err.statusCode);
  }
};
module.exports = {
  getBossRaidStatus,
};
