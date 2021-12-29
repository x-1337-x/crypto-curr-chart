// const { Model } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
// 	class Watchlist extends Model {
// 		/**
// 		 * Helper method for defining associations.
// 		 * This method is not a part of Sequelize lifecycle.
// 		 * The `models/index` file will call this method automatically.
// 		 */
// 		static associate(models) {
// 			// define association here
// 		}
// 	}
// 	Watchlist.init(
// 		{
// 			userId: {
// 				type: DataTypes.INTEGER,
// 				allowNull: false,
// 			},
// 			coinId: {
// 				type: DataTypes.INTEGER,
// 				allowNull: false,
// 			},
// 		},
// 		{
// 			sequelize,
// 			modelName: 'Watchlist',
// 		}
// 	);
// 	return Watchlist;
// };
