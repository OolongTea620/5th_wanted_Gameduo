require("dotenv").config();
const { createClient } = require("redis");

const redisCli = createClient({
  password: process.env.REDIS_PASSWORD,
});

redisCli.on("connect", () => {
  console.log("Redis Client Connect");
});

redisCli.on("error", (err) => {
  console.log("Redis Client Error", err);
});

module.exports = {
  redisCli,
};
