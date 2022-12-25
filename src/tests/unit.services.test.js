const { redisCli } = require("../cache");
const { settingScore } = require("../cache/initScore");
const userService = require("../services/userService");
const raidService = require("../services/raidRecordService");

beforeAll(async () => {
  await redisCli.connect();
  await redisCli.flushAll();
  await settingScore();
});

describe("userServiceTest", () => {
  test("createUser", async () => {
    const result = await userService.createUser();
    const totalUserCount = await redisCli.get("totalUser");
    expect(result.userId).toBe(1);
    expect(totalUserCount).toBe("1");
  });
});

describe("raidServiceTest", () => {
  test("bossRaid status -> enter true", async () => {
    await redisCli.del("bossRaid");
    const result = await raidService.getBossRaidStatus();
    expect(result.canEnter).toBe(true);
  });

  test("bossRaid status enter false", async () => {
    await raidService.startBossRaid(1, 1); // enterBossRaid isentered true
    const result = await raidService.getBossRaidStatus();
    expect(result.canEnter).toBe(false);
    expect(result.enterdUserId).toBe(1);
    await redisCli.del("bossRaid");
  });

  test("Start bossRaid success", async () => {
    const start = await raidService.startBossRaid(1, 1); //userId :1 , level 1
    expect(start.isEntered).toBe(true);
  });

  test("Start bossRaid fail", async () => {
    const start = await raidService.startBossRaid(1, 1); //userId :1 , level 1
    expect(start.isEntered).toBe(false);
    await redisCli.del("bossRaid");
    await redisCli.del("recentRaid");
  });

  test("end BossRaid, get score success", async () => {
    const result = await userService.createUser(); // userId : 2
    const start = await raidService.startBossRaid(result.userId, 1); // user2 in level 1
    await raidService.endBossRaid(result.userId, start.raidRecordId);

    const record = await redisCli.hGetAll(
      `raid:${start.raidRecordId}:${result.userId}`
    );
    const userScore = await redisCli.zScore("rank", `${result.userId}`);
    const addedScore = record.score;

    expect(userScore + "").toBe(addedScore);
  });
});

describe("userServiceTest : ", () => {
  test("getUserInfo", async () => {
    const result = userService.getUserInfoById(1); // 2번 유저 조회
  });
});
afterAll(async () => {
  await redisCli.flushAll(); //모든 키 삭제
  await redisCli.quit();
});
