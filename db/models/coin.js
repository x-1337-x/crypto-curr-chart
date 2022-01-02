const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Coin extends Model {
        static associate(models) {}
    }
    Coin.init(
        {
            coin_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                validate: { notNull: false, notEmpty: true },
                unique: true,
            },
            symbol: {
                type: DataTypes.STRING,
                validate: { notNull: false, notEmpty: true },
                unique: true,
            },
            description: {
                type: DataTypes.STRING,
                validate: { notNull: false, notEmpty: true },
            },
        },
        {
            sequelize,
            tableName: 'coins',
            modelName: 'Coin',
        }
    );
    return Coin;
};
