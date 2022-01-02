'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'coins',
            {
                coin_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: false,
                },
                symbol: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: false,
                },
                description: {
                    type: Sequelize.STRING,
                },
            },
            {
                createdAt: 'created_at',
                updatedAt: 'updated_at',
            }
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('coins');
    },
};
