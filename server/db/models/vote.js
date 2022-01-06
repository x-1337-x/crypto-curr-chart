const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Vote extends Model {
        static associate(models) {
            models.User.belongsToMany(models.Coin, {
                through: models.Vote,
                foreignKey: 'user_id',
                as: 'VoteCoin',
            });
            models.Coin.belongsToMany(models.User, {
                through: models.Vote,
                foreignKey: 'coin_id',
                as: 'VoteUser',
            });
        }
    }
    Vote.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            coin_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            date: {
                type: DataTypes.DATEONLY,
                primaryKey: true,
            },
        },
        {
            sequelize,
            modelName: 'Vote',
            tableName: 'votes',
            timestamps: false,
        }
    );
    return Vote;
};
