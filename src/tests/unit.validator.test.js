const { redisCli } = require("../cache");
const { settingScore } = require("../cache/initScore");
const {
  startBossRaidValidator,
  endBossRaidValidator,
} = require("../middlewares/validator");

beforeAll(async () => {
  await redisCli.connect();
  await redisCli.flushAll();

  await settingScore();
});
afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await redisCli.flushAll();
  await redisCli.quit();
});

describe("startBossRaid vaidator", () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("success case", async () => {
    const req = {
      body: { userId: 1, level: 1 },
    };
    await startBossRaidValidator(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});

describe("endBossRaid vaidator", () => {
  test("success case", async () => {});
});
