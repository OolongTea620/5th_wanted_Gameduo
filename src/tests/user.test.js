const request = require("supertest");
const { createApp } = require("../../app");
const { sequelize } = require("../models");

beforeAll(async () => {
  app = createApp();
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.query(`SET foreign_key_checks = 0`);
  await sequelize.query(`TRUNCATE user`);
  await sequelize.query(`SET foreign_key_checks = 1`);
  await sequelize.close();
});

describe("POST /user", () => {
  test("create user : success", async () => {
    const response = await request(app).post("/user");
    expect(response.status).toEqual(201);
    expect(!!response.body.userId).toEqual(true);
  });
});
