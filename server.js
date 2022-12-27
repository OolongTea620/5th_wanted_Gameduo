require("dotenv").config();
const { createApp } = require("./app");
const { sequelize } = require("./src/models");
const { redisCli } = require("./src/cache");
const { settingScore } = require("./src/cache/initScore");

const startServer = async () => {
  const app = createApp();
  const PORT = process.env.PORT;

  await sequelize
    .sync({ force: false, alter: true })
    .then(() => {
      console.log("연결 성공!");
    })
    .catch((err) => {
      console.error(err);
    });
  await redisCli.connect();
  settingScore();

  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};

startServer();
