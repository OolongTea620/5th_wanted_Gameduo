require("dotenv").config();
const axios = require("axios");
const { redisClient } = require("./index");

const splitScore = async (levels) => {
  try {
    await redisClient.v4.del("scoreboard");
    for (data of levels) {
      await redisClient.v4.hSet("scoreboard", `${data.level}`, `${data.score}`);
    }
  } catch (err) {
    console.log(err);
  }
};

const updateRaidScoreWithRedis = async (data) => {
  try {
    const info = data.bossRaids;
    for (let score of info) {
      const keys = Object.keys(score);
      for (let key of keys) {
        if (key === "bossRaidLimitSeconds") {
          await redisClient.v4.set("limitSeconds", score[key]);
        } else if (key === "levels") {
          await splitScore(score[key]);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const getRaidScoreToS3 = async () => {
  try {
    const URL = process.env.BOSSRAID_INFO_URL;
    const response = await axios.get(URL);
    updateRaidScoreWithRedis(response.data);
  } catch (err) {
    // 실패시, asset폴더에 수동으로 update
  }
};

const settingScore = async () => {
  try {
    const isScore = await redisClient.v4.hGetAll("scoreboard");
    const isSecond = await redisClient.v4.get("limitSeconds");
    if (!isScore || !isSecond) {
      console.log("----setting raid score----");
      await getRaidScoreToS3();
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  settingScore,
};
