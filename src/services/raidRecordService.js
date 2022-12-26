const { redisCli } = require("../cache");
const error = require("../middlewares/errorConstructor");

const getRankingListByuserId = async (userId) => {
  let ranklist = [];

  const myRank = await redisCli.zRevRank("rank", `${userId}`);
  const ranking = await redisCli.sendCommand([
    "ZREVRANGE",
    "rank",
    "0",
    "-1",
    "WITHSCORES",
  ]);

  for (let i = 0; i < ranking.length; i += 2) {
    ranklist.push({
      ranking: i / 2,
      userId: Number(ranking[i]),
      totalScore: Number(ranking[i + 1]),
    });
  }
  const myRankIdx = parseInt(myRank);
  const myRankingInfo = ranklist[myRankIdx];

  return { topRankerInfoList: ranklist, myRankingInfo };
};
module.exports = { getRankingListByuserId };
