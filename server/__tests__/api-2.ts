import request from 'supertest';
import app from '../app';
import { setupDB } from '../db_typeorm';
import { Coin } from '../db_typeorm/entity/Coin';

beforeAll(async () => {
    const connection = await setupDB('test');
    app.set('db2', connection);
});

afterAll(async () => {
    await app.get('db').sequelize.close();
    await app.get('db2').close();
});

describe('API', function () {
    test('POST /api/coins', async function () {
        await request(app)
            .post('/api/coins')
            .send({ name: 'Bitcoin', symbol: 'BTC', description: 'bitok' })
            .expect(200);
    });

    test('GET /api/coins', async function () {
        await request(app)
            .get('/api/coins')
            .expect(200)
            .then((r) => {
                let coins = r.body;
                expect(coins).toBeDefined();
                expect(Array.isArray(coins)).toBeTruthy();
                let bitcoin = coins.find((el: Coin) => {
                    return el.name === 'Bitcoin';
                });
                expect(bitcoin).not.toBeNull();
                expect(bitcoin).toMatchObject({
                    name: 'Bitcoin',
                    symbol: 'BTC',
                    description: 'bitok',
                    coin_id: expect.any(Number),
                });
            });
    });
});
