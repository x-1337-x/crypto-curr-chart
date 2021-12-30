const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    static associate(models) {
      models.User.belongsToMany(models.Coin, {
        through: models.Vote,
        foreignKey: "userId",
        as: "VoteCoin",
      });
      models.Coin.belongsToMany(models.User, {
        through: models.Vote,
        foreignKey: "coinId",
        as: "VoteUser",
      });
    }
  }
  Vote.init(
    {
      date: {
        type: DataTypes.DATEONLY,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      coinId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "Vote",
      // indexes: [{ unique: true, fields: ['userId', 'coinId', 'date'] }],
    }
  );
  return Vote;
};
