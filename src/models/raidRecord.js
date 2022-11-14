const Sequelize = require("sequelize");

module.exports = class RaidRecord extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        raidRecordId: {
          type: Sequelize.BIGINT.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        score: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        enterTime: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        endTime: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "RaidRecord",
        tableName: "raidRecord",
        charset: "utf8mb4",
      }
    );
  }

  static associate(db) {
    db.RaidRecord.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "userId",
    });
  }
};
