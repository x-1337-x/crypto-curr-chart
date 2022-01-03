const request = require('supertest');
const { exec } = require('child_process');

const app = require('../app');

const db = app.get('db').sequelize;

beforeAll((done) => {
    exec('npm run apply-migrations', function () {
        done();
    });
}, 30000);

afterAll((done) => {
    exec('npm run kill-all-migrations', function () {
        db.close();
        done();
    });
}, 30000);

describe('API', function () {
    test('POST /api/coins', function (done) {
        request(app)
            .post('/api/coins')
            .send({ name: 'Bitcoin', symbol: 'BTC', description: 'bitok' })
            .expect(200, done);
    });

    test('GET /api/coins', function (done) {
        request(app).get('/api/coins').expect(200, done);
    });

    test('POST /register', function (done) {
        request(app)
            .post('/register')
            .send({ email: 'aaa@bbb', password: '123', repeatPassword: '123' })
            .expect(200, done);
    });
});
