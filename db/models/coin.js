const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Coin extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Coin.belongsToMany(models.User, {
				through: 'Watchlist',
				foreignKey: 'coinId',
			});
		}
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
			modelName: 'Coin',
		}
	);
	return Coin;
};
