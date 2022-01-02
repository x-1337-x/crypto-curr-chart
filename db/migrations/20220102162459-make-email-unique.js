'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        queryInterface.changeColumn('users', 'email', {
            type: Sequelize.STRING,
            unique: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.changeColumn('users', 'email', {
            type: Sequelize.STRING,
            unique: false,
        });
    },
};
