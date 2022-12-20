require("dotenv").config();

const { createApp } = require("./app");
const { redisClient } = require("./src/cache");
const startServer = async () => {
  const app = createApp();
  const PORT = process.env.PORT;
  // redis-node : legacyMode
  await redisClient.connect();

  // test
  // await redisClient.v4.set("key", "value");
  // const value = await redisClient.v4.get("key");
  // console.log(value);

  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};

startServer();
