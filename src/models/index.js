const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

const User = require("./user");
const RaidRecord = require("./raidRecord");
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;
db.RaidRecord = RaidRecord;

db.User.init(sequelize);
db.RaidRecord.init(sequelize);

User.associate(db);
RaidRecord.associate(db);

module.exports = db;
