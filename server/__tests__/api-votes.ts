import request from 'supertest';
import app from '../app';
import { setupDB } from '../db_typeorm';
import { getDB } from '../utils/getDB';

let token: string | null = null;
let user_id: string | number | null = null;
let coin_id: string | number | null = null;
let date: Date = new Date();

beforeAll(async () => {
    const connection = await setupDB('test');
    app.set('db', connection);

    await request(app).post('/register').send({
        email: 'testuser111@test',
        password: 'test',
        repeatPassword: 'test',
    });

    await request(app).post('/api/coins').send({
        name: 'testCoint',
        symbol: 'test',
    });

    const response = await request(app)
        .post('/login')
        .send({ email: 'testuser111@test', password: 'test' });

    token = response.body.token;
    console.log(token);

    let user = await getDB(app).query(
        `select * from users where email='testuser111@test'`
    );

    user_id = user[0].user_id;

    let coins = await getDB(app).query(`select * from coins`);

    coin_id = coins[0].coin_id;

    console.log(`BEFORE ALL: `, user_id, coins, coin_id, token);
});

afterAll(async () => {
    await getDB(app).close();
});

describe('API', () => {
    test('POST /api/votes/:coinId with valid data', async () => {
        await request(app)
            .post(`/api/votes/${coin_id}`)
            .send({ user_id, date, token })
            .expect(200);
    });
    test('POST /api/votes/:coinId, attempting to vote for the same coin more than once a day', async () => {
        await request(app)
            .post(`/api/votes/${coin_id}`)
            .send({ user_id, date, token })
            .expect(500);
    });

    test('GET /api/votes', async () => {
        await request(app)
            .get('/api/votes/')
            .send({ user_id, token })
            .expect(200)
            .then((r) => {
                let votes = r.body;
                expect(votes).toBeDefined();
                expect(Array.isArray(votes)).toBeTruthy();
                for (let v of votes) {
                    expect(v).toMatchObject({
                        user_id: expect.any(Number),
                        coin_id: expect.any(Number),
                    });
                    expect(new Date(v.date).toString()).not.toBe(
                        'Invalid Date'
                    );
                }
            });
    });
});
