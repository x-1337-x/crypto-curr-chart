import request from 'supertest';
import app from '../app';
import { setupDB } from '../db_typeorm';

beforeAll(async () => {
    const connection = await setupDB('test');
    app.set('db2', connection);
});

afterAll(async () => {
    await app.get('db').sequelize.close();
    await app.get('db2').close();
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
