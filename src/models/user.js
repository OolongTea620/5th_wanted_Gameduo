const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        totalScore: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: false,
        charset: "utf8mb4",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.RaidRecord, {
      foreignKey: "userId",
      sourceKey: "id",
      onDelete: "cascade",
    });
  }
};
