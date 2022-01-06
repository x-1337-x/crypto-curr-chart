import app from './server/app';

module.exports = async () => {
    await app.get('db').sequelize.sync({ force: true });
    await app.get('db').sequelize.close();
};
