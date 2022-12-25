const { redisCli } = require("../cache");
const error = require("../middlewares/errorConstructor");

/**
 * totalUser 1증가, usersScore에 등록
 * @returns obj {userId : number}
 */

const createUser = async () => {
  try {
    const totalUser = await redisCli.get("totalUser");
    if (totalUser === "0" || !totalUser) {
      await redisCli.set("totalUser", "0");
    }

    const cUserCount = await redisCli.get("totalUser");
    const newUserId = Number(cUserCount) + 1;

    const [incrReulst, addRankResult, userAddReult] = await redisCli
      .multi()
      .zAdd("rank", { score: 0, value: `${newUserId}` })
      .incr("totalUser", 1)
      .exec();

    return { userId: newUserId };
  } catch (err) {
    console.log(err);
  }
};

const getUserInfoById = async (userId) => {
  try {
    const totalScore = await redisCli.zScore(`rank`, `${userId}`);

    const results = await redisCli.scan(0, {
      MATCH: `raid:**:${userId}`,
    });

    console.log("scan return", results.keys);

    return {
      totalScore,
      bossRaidHistory: "history",
    };
  } catch (err) {
    console.error(err);
  }
};

module.exports = { createUser, getUserInfoById };
