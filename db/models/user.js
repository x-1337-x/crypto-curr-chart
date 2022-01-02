const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {}
    }
    User.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
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
            tableName: 'users',
            modelName: 'User',
            timestamps: false,
        }
    );
    return User;
};
