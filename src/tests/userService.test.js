const { redisClient } = require("../cache");
const userService = require("../services/userService");

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

afterAll(async () => {
  await redisClient.flushAll();
  await redisClient.disconnect();
});
