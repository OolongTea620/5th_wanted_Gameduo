require("dotenv").config();
const { createClient } = require("redis");

const redisClient = createClient({
  legacyMode: true,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("connect", () => {
  console.log("Redis Client Connect");
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
});

module.exports = {
  redisClient,
};
