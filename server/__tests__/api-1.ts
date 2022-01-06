import request from 'supertest';
import { getConnection } from 'typeorm';
import app from '../app';
import { setupDB } from '../db_typeorm';

beforeAll(async () => {
    await setupDB();
});

afterAll(async () => {
    await app.get('db').sequelize.close();
    const db = getConnection();
    await db.close();
});

describe('API', function () {
    test('POST /register', async function () {
        const payloads = [
            {},
            { password: '123', repeatPassword: '234' },
            { email: 'aaa@bbb', repeatPassword: '123' },
            { email: 'aaa@bbb', password: '123' },
            { email: 'aaa@bbb', password: '123', repeatPassword: '234' },
        ];

        for (const payload of payloads) {
            await request(app).post('/register').send(payload).expect(400);
        }
    });

    test('POST /register', async function () {
        await request(app)
            .post('/register')
            .send({ email: 'aaa@bbb', password: '123', repeatPassword: '123' })
            .expect(200);
    });

    test('POST /login', async function () {
        await request(app)
            .post('/login')
            .send({ email: 'aaa@bbb', password: Math.random().toString() })
            .expect(400);
    });

    test('POST /login', async function () {
        await request(app)
            .post('/login')
            .send({ email: 'aaa@bbb', password: '123' })
            .expect(200)
            .then((r) => {
                expect(r.body).toBeDefined();
                expect(r.body.token).toBeDefined();
            });
    });
});
