const { sequelize } = require("../models");
const { redisCli } = require("../cache");

const { settingScore } = require("../cache/initScore");
const User = require("../models/user");
const userService = require("../services/userService");
const raidService = require("../services/raidService");
const raidRecordService = require("../services/raidRecordService");

beforeAll(async () => {
  await sequelize
    .sync({ force: false, alter: false })
    .then(() => {
      console.log("연결 성공!");
    })
    .catch((err) => {
      console.error(err);
    });

  await redisCli.connect();
  await redisCli.flushAll();
  await settingScore();
});

describe("userServiceTest", () => {
  test("createUser", async () => {
    // 첫번째 유저 생성
    const result = await userService.createUser();
    expect(result.userId).toBe(1);
  });
});

describe("raidServiceTest", () => {
  test("bossRaid status -> enter true", async () => {
    const result = await raidService.getBossRaidStatus();
    expect(result.canEnter).toBe(true);
  });

  test("bossRaid status enter false", async () => {
    await userService.createUser(); // 2번 유저 생성
    const start = await raidService.startBossRaid(2, 1);
    const raidId = start.raidRecordId;

    const result = await raidService.getBossRaidStatus();
    expect(result.canEnter).toBe(false);
    expect(result.enterdUserId).toBe(2);
    await raidService.endBossRaid(2, raidId);
  });

  test("Start bossRaid success", async () => {
    const start = await raidService.startBossRaid(2, 1); //userId :2 , level 1
    expect(start.isEntered).toBe(true);
  });

  test("Start bossRaid fail", async () => {
    const start = await raidService.startBossRaid(1, 1); //userId :1 , level 1
    expect(start.isEntered).toBe(false);
    await redisCli.del("bossRaid");
  });

  test("end BossRaid, get score success", async () => {
    const result = await userService.createUser();
    const start = await raidService.startBossRaid(result.userId, 2); // userid : 3 , level : 2
    const bossRaid = await redisCli.hGetAll("bossRaid");
    const addedScore = bossRaid.score;

    await raidService.endBossRaid(result.userId, start.raidRecordId);
    const user = await User.findOne({ where: { id: result.userId } });

    expect(user.totalScore + "").toBe(addedScore);
  });
});

describe("userServiceTest : ", () => {
  test("getUserInfo", async () => {
    const user1 = await userService.getUserInfoById(1); // 1번 유저 조회
    expect(user1.totalScore).toBe(0);
    expect(user1.bossRaidHistory).toHaveLength(0);

    const user2 = await userService.getUserInfoById(2); // 2번 유저 조회
    expect(user2.totalScore).toBe(47);
    expect(user2.bossRaidHistory).toHaveLength(2);

    const user3 = await userService.getUserInfoById(3); // 3번 유저 조회
    expect(user3.totalScore).toBe(85);
    expect(user3.bossRaidHistory).toHaveLength(1);
  });
});

describe("raidRecordService ", () => {
  test("getUserInfo", async () => {
    const user1 = await raidRecordService.getRankingListByuserId(1);
    expect(user1.topRankerInfoList).toHaveLength(3);
    expect(user1.myRankingInfo.ranking).toBe(2);
  });
});

afterAll(async () => {
  await redisCli.flushAll();
  await redisCli.quit();

  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  await sequelize.query("TRUNCATE TABLE raidRecords");
  await sequelize.query("TRUNCATE TABLE users");
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
  await sequelize.close();
});
