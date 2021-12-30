const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Watchlist extends Model {
    static associate(models) {
      models.User.belongsToMany(models.Coin, {
        through: models.Watchlist,
        foreignKey: "userId",
        as: "WatchlistCoin",
      });
      models.Coin.belongsToMany(models.User, {
        through: models.Watchlist,
        foreignKey: "coinId",
        as: "WatchlistUser",
      });
    }
  }
  Watchlist.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      coinId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Coin",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Watchlist",
    }
  );
  return Watchlist;
};
