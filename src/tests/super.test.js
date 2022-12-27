/**
 * 통합 테스트
 */
const request = require("supertest");
const { createApp } = require("../../app");

const { sequelize } = require("../models");
const { redisCli } = require("../cache");
const { settingScore } = require("../cache/initScore");

beforeAll(async () => {
  app = createApp();
  await sequelize
    .sync({})
    .then(() => {
      console.log("연결 성공!");
    })
    .catch((err) => {
      console.error(err);
    });
  redisCli.connect();
  await redisCli.flushAll();
  await settingScore();
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

/**
 *
 */
describe("POST /user", () => {
  test("[success] 201 create user", async () => {
    const response = await request(app).post("/user").send({});
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("userId");
  });

  // test("[fail] 500 create user", async () => {});
});

describe("GET /user/{userId}", () => {
  test("[success] 200 get user info", async () => {
    const response = await request(app).get("/user/1");

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("totalScore");
    expect(response.body).toHaveProperty("bossRaidHistory");
  });

  test("[error] 404 Invalid User", async () => {
    const response = await request(app).get("/user/100"); // userId : 100 <- user created yet

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ message: "NotFound User" });
  });

  // test("[fail] 500 Server Error", async () => {
  //   const response = await request(app).get("/user/Error");
  // });
});

describe("GET /bossRaid", () => {
  test("[success] 200 canEnter true", async () => {
    const response = await request(app).get("/bossRaid");

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ canEnter: true });
  });

  test("[fail] 200 canEnter false", async () => {
    await redisCli.hSet("bossRaid", [
      "score",
      "20",
      "userId",
      "1",
      "raidId",
      "temp",
    ]); //mock data

    const response = await request(app).get("/bossRaid");
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ canEnter: false, enterdUserId: 1 });

    await redisCli.del("bossRaid");
  });
});

describe("POST /bossRaid/enter", () => {
  const EnterUserId = 1;
  const level1 = 1;

  test("[success] 201 enter", async () => {
    const response = await request(app).post("/bossRaid/enter").send({
      userId: EnterUserId,
      level: level1,
    }); // user:1 level :1
    expect(response.body.isEntered).toBeTruthy();
    expect(response.body.raidRecordId).toEqual(1);
  });

  test("[falil] 200 user:1 already in bossRaid", async () => {
    const response = await request(app).post("/bossRaid/enter").send({
      userId: 2,
      level: level1,
    });
    expect(response.body.isEntered).toBeFalsy();
    expect(response.body.raidRecordId).toEqual(1);
  });
});

describe("POST /bossRaid/end : ", () => {
  test("[success] raidEnd success", async () => {
    await request(app).post("/bossRaid/enter").send({
      userId: 2,
      level: 1,
    }); // enterBossRaid
    const end = await request(app).patch("/bossRaid/end").send({
      userId: 2,
      raidRecordId: 2,
    });
    expect(end.status).toBe(200);
    expect(end.body).toEqual({});
  });
});

describe("Get /bossRaid/ranking : ", () => {
  test("[success] Get info", async () => {
    const response = await request(app).post("/bossRaid/topRankerList").send({
      userId: 1,
    });
    expect(response.status).toBe(200);
  });

  test("[error] 400 userId isn't have", async () => {
    const response = await request(app)
      .post("/bossRaid/topRankerList")
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Invalid Value");
  });

  test("[error] 400 userId isn't number", async () => {
    const response = await request(app)
      .post("/bossRaid/topRankerList")
      .send({ userId: "testest" });
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Invalid Value");
  });

  test("[error] 400 userId incurrect key name", async () => {
    const response = await request(app)
      .post("/bossRaid/topRankerList")
      .send({ userIdID: 1 }); // keyname incurrect
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Invalid Value");
  });
});
