const request = require("supertest");
const { createApp } = require("../../app");
const { sequelize } = require("../models");

beforeAll(async () => {
  app = createApp();
  await sequelize.sync();

  sequelize.query("insert into users() values()");
  sequelize.query("insert into users() values()");
});

afterAll(async () => {
  await sequelize.query(`SET foreign_key_checks = 0`);
  await sequelize.query(`TRUNCATE user`);
  await sequelize.query(`SET foreign_key_checks = 1`);
  await sequelize.close();
});

describe("bossRaid", () => {
  test("get status : {entered : true}", async () => {
    const response = await request(app).get("/bossRaid");
    expect(response.status).toEqual(200);
    expect(response.body.canEnter).toEqual(true);
  });

  test("get status entered : invalid user error  ", async () => {
    const response = await request(app).post("/bossRaid/enter").send({
      userId: 100, // invalid user
    });
    expect(response.status).toEqual(400);
  });

  test("get status entered : userEnter Success  ", async () => {
    const userCreateRes = await request(app).post("/user").expect(201);
    const userId = userCreateRes.body.userId;

    const response2 = await request(app).post("/bossRaid/enter").send({
      userId: userId,
      level: 1,
    });
    expect(response2.status).toEqual(201);
  });

  test("user bossRaid entered -> end success ", async () => {
    const userCreateRes = await request(app).post("/user").expect(201);
    const userId = userCreateRes.body.userId;

    const responseEnter = await request(app).post("/bossRaid/enter").send({
      userId: userId,
      level: 1,
    });
    const raidRecordId = responseEnter.body.raidRecordId;

    const responseEnd = await request(app).post("/bossRaid/end").send({
      userId,
      raidRecordId,
    });
    expect(responseEnd.status).toEqual(200);
  });
});
