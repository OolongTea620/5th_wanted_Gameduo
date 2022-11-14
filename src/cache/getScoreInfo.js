require("dotenv").config();
const axios = require("axios");
const { bossRaidCache } = require("./raidRecordCache");

const getScoreInfo = async () => {
  try {
    const response = await axios.get(process.env.BOSSRAID_INFO);
    return response.data.bossRaids;
  } catch (error) {
    console.error("axios error");
  }
};

const cacheRaidInfo = (info) => {
  if (!bossRaidCache.get("limitSeconds")) {
    bossRaidCache.set("limitSeconds", info.limitSeconds);
  }
  if (!bossRaidCache.get("scores")) {
    bossRaidCache.set("scores", info.scores);
  }
};

const putScoreInfoCache = async () => {
  try {
    const bossRaids = await getScoreInfo();

    const s3data = bossRaids.reduce((acc, obj) => {
      if ("bossRaidLimitSeconds" in obj) {
        acc.limitSeconds = obj.bossRaidLimitSeconds;
      }
      if ("levels" in obj) {
        acc.scores = {};
        for (info of obj.levels) {
          acc.scores[info.level.toString()] = info.score;
        }
      }
      return acc;
    }, {});
    cacheRaidInfo(s3data);
  } catch (error) {
    return null; // 입력하지 않는 걸로 마무리
  }
};

module.exports = putScoreInfoCache;
