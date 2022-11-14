require("dotenv").config();

const { createApp } = require("./app");
const { sequelize } = require("./src/models");

const startServer = async () => {
  const app = createApp();
  const PORT = process.env.PORT;

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
};

startServer();
