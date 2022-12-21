require("dotenv").config();
const { createApp } = require("./app");
const { redisClient } = require("./src/cache");
const { settingScore } = require("./src/cache/initScore");

const startServer = async () => {
  const app = createApp();
  const PORT = process.env.PORT;

  // redis-node : 4.5.1 legacyMode
  await redisClient.connect();
  settingScore();

  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};

startServer();
