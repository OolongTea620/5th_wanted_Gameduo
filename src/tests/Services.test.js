const { redisClient } = require("../cache");
const userService = require("../services/userService");
const raidService = require("../services/raidRecordService");

beforeAll(async () => {
  await redisClient.connect();
  await redisClient.flushAll();
});

describe("userServiceTest", () => {
  test("createUser", async () => {
    const result = await userService.createUser();
    const usersScoreCount = await redisClient.v4.zCard("usersScore");
    expect(result.userId).toBe(1);
    expect(usersScoreCount).toBe(1);
  });
});

describe("raidServiceTest", () => {
  test("Get bossRaid status -> enter true", async () => {
    const result = await raidService.getBossRaidStatus();
    expect(result.canEnter).toBe(true);
  });

  test("Get bossRaid status -> cannot false", async () => {
    await redisClient.v4.sendCommand(["HMSET", "bossRaid", "userId", "1"]);
    const result = await raidService.getBossRaidStatus();
    expect(result.canEnter).toBe(false);
  });
});

afterAll(async () => {
  await redisClient.flushAll();
  await redisClient.disconnect();
});
