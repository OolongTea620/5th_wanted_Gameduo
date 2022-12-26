const Sequelize = require("sequelize");

module.exports = class RaidRecord extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        score: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
        level: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        enterTime: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        endTime: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "RaidRecord",
        tableName: "raidRecords",
        charset: "utf8mb4",
      }
    );
  }

  static associate(db) {
    db.RaidRecord.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "id",
    });
  }
};
