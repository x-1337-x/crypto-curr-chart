const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Watchlist extends Model {
        static associate(models) {
            models.User.belongsToMany(models.Coin, {
                through: models.Watchlist,
                foreignKey: 'user_id',
                as: 'WatchlistCoin',
            });
            models.Coin.belongsToMany(models.User, {
                through: models.Watchlist,
                foreignKey: 'coin_id',
                as: 'WatchlistUser',
            });
        }
    }
    Watchlist.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                primaryKey: true,
            },
            coin_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'coins',
                    key: 'id',
                },
                primaryKey: true,
            },
        },
        {
            sequelize,
            tableName: 'watchlists',
            modelName: 'Watchlist',
            timestamps: false,
        }
    );
    return Watchlist;
};
