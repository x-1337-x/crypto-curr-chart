import request from 'supertest';
import app from '../app';

afterAll(async () => {
    await app.get('db').sequelize.close();
});

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
});
