'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'watchlists',
            {
                user_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'users',
                        key: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    primaryKey: true,
                },
                coin_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'coins',
                        key: 'coin_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    primaryKey: true,
                },
            },
            {
                timestamps: false,
            }
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('watchlists');
    },
};
