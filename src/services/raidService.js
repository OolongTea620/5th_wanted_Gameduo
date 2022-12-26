const { redisCli } = require("../cache");
const { sequelize } = require("../models");
const User = require("../models/user");
const RaidRecord = require("../models/raidRecord");
const error = require("../middlewares/errorConstructor");

const getBossRaidStatus = async () => {
  try {
    let raidStatus = { canEnter: true };

    const bossRaidExist = await redisCli.exists("bossRaid");
    if (!bossRaidExist) {
      return raidStatus;
    }

    const bossRaid = await redisCli.hGetAll("bossRaid");
    raidStatus.enterdUserId = Number(bossRaid.userId);
    raidStatus.canEnter = false;

    return raidStatus;
  } catch (err) {
    console.log(err);
    throw new error(err.message, err.statusCode);
  }
};

const addSeconds = (enterTime = new Date(), seconds) => {
  let endTime = new Date();
  endTime.setSeconds(endTime.getSeconds() + seconds);
  return endTime;
};

const startBossRaid = async (userId, level) => {
  let receipt = {
    isEntered: false,
  };

  const bossRaidExist = await redisCli.exists("bossRaid");
  if (bossRaidExist) {
    return receipt;
  }
  const score = await redisCli.hGet("scoreboard", `${level}`);
  const limits = await redisCli.get("limitSeconds");
  const enterTime = new Date();
  const endTime = addSeconds(enterTime, Number(limits));

  const transaction = await sequelize.transaction();
  const newRaid = await RaidRecord.create(
    { userId, level, enterTime, endTime },
    { transaction: transaction }
  );

  const newRaidId = newRaid.id;
  const results = await redisCli
    .multi()
    .hSet("bossRaid", ["score", score, "userId", userId, "raidId", newRaidId])
    .hSet("recentRaid", ["score", score, "userId", userId, "raidId", newRaidId])
    .expire("bossRaid", limits)
    .exec();

  await transaction.commit();

  receipt.isEntered = true;
  receipt.raidRecordId = newRaidId;
  return receipt;
};

const endBossRaid = async (userId, raidRecordId) => {
  // bossRaid 조회
  const isbossRaid = await redisCli.exists("bossRaid");
  const recentRaid = await redisCli.hGetAll("recentRaid");

  if (!isbossRaid && recentRaid) {
    throw new error("Timeout ", 400);
  }

  const bossRaid = await redisCli.hGetAll("bossRaid");
  if (
    bossRaid.userId !== String(userId) ||
    bossRaid.raidId !== String(raidRecordId)
  ) {
    throw new error("get score fail", 200);
  }
  const transaction = await sequelize.transaction();
  const endTime = new Date();
  const score = bossRaid.score;

  const results = await redisCli
    .multi()
    .zIncrBy("rank", score, `${userId}`)
    .del("bossRaid")
    .exec();

  await User.increment(
    { totalScore: parseInt(score) },
    { where: { id: userId } },
    { transaction: transaction }
  );
  await User.update({ endTime }, { where: { id: userId } });
  await transaction.commit();

  return {};
};

module.exports = {
  getBossRaidStatus,
  startBossRaid,
  endBossRaid,
};
