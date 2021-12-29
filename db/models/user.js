const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.belongsToMany(models.Coin, {
				through: 'Watchlist',
				foreignKey: 'userId',
			});
		}
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
			modelName: 'User',
		}
	);
	return User;
};
