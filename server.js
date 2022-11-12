require("dotenv").config();

const { createApp } = require("./app");
const { sequelize } = require("./src/models");
const redis = require("redis");

const startServer = async () => {
  const app = createApp();
  const PORT = process.env.PORT;
  const redisClient = redis.createClient({ legacyMode: true });

  await sequelize
    .sync({ force: false, alter: false })
    .then(() => {
      console.log("mysql 연결 성공");
    })
    .catch((err) => {
      console.error(err);
    });

  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });

  redisClient.on("connect", () => console.log("Redis Connect success"));
  redisClient.on("error", (err) => console.log("Redis Client Error", err));

  await redisClient.connect();
};

startServer();
