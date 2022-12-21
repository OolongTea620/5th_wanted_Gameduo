const { redisClient } = require("../cache");
const redis = redisClient.v4; //redis-node : 4.5.1 legacyMode
const error = require("../middlewares/errorConstructor");

/**
 * @description totalUser 1증가, usersScore에 등록
 * @returns obj {userId : number}
 */

const createUser = async () => {
  try {
    const totalUser = await redis.get("totalUser");
    if (totalUser === "0" || !totalUser) {
      await redis.set("totalUser", "0");
    }

    const userId = await redis.incr("totalUser", 1);
    const result = await redis.sendCommand([
      "ZADD",
      "usersScore",
      "0",
      `${userId}`,
    ]);

    return { userId };
  } catch (err) {
    console.log(err);
  }
};

const getUserInfoById = async (userId) => {
  // try {
  //   const userTotalScore = await redisClient.hGet("usersScore", String(userId));
  //   const history = await redisClient.sendCommand(""); //key에 userId가 들어가는 모든 값 가져오기
  //   return {
  //     totalScore: Number(userTotalScore),
  //     bossRaidHistory: history,
  //   };
  // } catch (err) {
  //   throw new error(err.message, err.statusCode);
  // }
};

const addUserTotalScore = async (userId, score) => {
  // try {
  //   const result = await redisClient.incrBy("usersScore", `${userId}`, score);
  //   console.info(`유저 ${userId}, ${score}점 획득`);
  //   return result;
  // } catch (err) {
  //   throw new error(err.status, err.message);
  // }
};
module.exports = { createUser, getUserInfoById };
