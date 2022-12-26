const { redisCli } = require("../cache");
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
    //throw new error(err.message, err.statusCode);
  }
};

const addSeconds = (enterTime = new Date(), seconds) => {
  let endTime = new Date();
  endTime.setSeconds(endTime.getSeconds() + seconds);
  return endTime;
};

const startBossRaid = async (userId, level) => {
  try {
    let receipt = {
      isEntered: false,
    };

    const bossRaidExist = await redisCli.exists("bossRaid");
    if (bossRaidExist) {
      return receipt;
    }

    const totalRaid = await redisCli.get("totalRaid");
    if (!totalRaid) {
      await redisCli.set("totalRaid", "0");
    }
    const cRaidCount = await redisCli.get("totalRaid");
    const newRaidId = Number(cRaidCount) + 1;

    // 점수 조회, 제한시간조회, 시간 준비
    const score = await redisCli.hGet("scoreboard", `${level}`);
    const limits = await redisCli.get("limitSeconds");
    const enterTime = new Date().toTimeString();
    const endTime = addSeconds(enterTime, Number(limits)).toTimeString();

    const results = await redisCli
      .multi()

      .hSet("bossRaid", ["score", score, "userId", userId, "raidId", newRaidId])
      .hSet("recentRaid", [
        "score",
        score,
        "userId",
        userId,
        "raidId",
        newRaidId,
      ])
      .hSet(`raid:${newRaidId}:${userId}`, [
        "raidRecordId",
        newRaidId,
        "score",
        "0",
        "enterTime",
        enterTime,
        "endTime",
        endTime,
      ])
      .expire("bossRaid", limits)
      .incr("totalRaid", 1)
      .exec();

    receipt.isEntered = true;
    receipt.raidRecordId = newRaidId;

    return receipt;
  } catch (err) {
    console.log(err);
  }
};

const endBossRaid = async (userId, raidRecordId) => {
  try {
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
      console.lop("invalid input");
      throw new error("invalid input", 400);
    }

    nowTime = new Date().toTimeString();
    const score = bossRaid.score;

    const results = await redisCli
      .multi()
      .hSet(`raid:${raidRecordId}:${userId}`, "endTime", nowTime)
      .hIncrBy(`raid:${raidRecordId}:${userId}`, "score", score)
      .zIncrBy("rank", score, `${userId}`)
      .del("bossRaid")
      .exec();

    return {};
  } catch (err) {}
};

module.exports = {
  getBossRaidStatus,
  startBossRaid,
  endBossRaid,
};
