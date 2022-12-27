require("dotenv").config();
const axios = require("axios");
const { redisCli } = require("./index");

const splitScore = async (levels) => {
  try {
    await redisCli.del("scoreboard");
    for (data of levels) {
      await redisCli.hSet("scoreboard", `${data.level}`, `${data.score}`);
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
          await redisCli.set("limitSeconds", score[key]);
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
    const isScore = await redisCli.hGetAll("scoreboard");
    const isSecond = await redisCli.get("limitSeconds");
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
