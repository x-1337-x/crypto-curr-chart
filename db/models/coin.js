const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Coin extends Model {
    static associate(models) {}
  }
  Coin.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: { notNull: false, notEmpty: true },
      },
      symbol: {
        type: DataTypes.STRING,
        validate: { notNull: false, notEmpty: true },
      },
      // contractAddress: {
      // 	type: DataTypes.STRING,
      // 	validate: { notNull: false, notEmpty: true },
      // },
      description: {
        type: DataTypes.STRING,
        validate: { notNull: false, notEmpty: true },
      },
    },
    {
      sequelize,
      modelName: "Coin",
    }
  );
  return Coin;
};
