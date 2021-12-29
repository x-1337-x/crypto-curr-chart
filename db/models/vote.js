const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Vote extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			models.Coin.belongsToMany(models.User, {
				through: 'Vote',
				foreignKey: 'coinId',
			});

			models.User.belongsToMany(models.Coin, {
				through: 'Vote',
				foreignKey: 'userId',
			});
		}
	}
	Vote.init(
		{
			date: {
				type: DataTypes.DATEONLY,
			},
		},
		{
			sequelize,
			modelName: 'Vote',
		}
	);
	return Vote;
};
