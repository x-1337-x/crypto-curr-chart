const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        validate: { notNull: false, notEmpty: true },
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        validate: { notNull: false, notEmpty: true },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
