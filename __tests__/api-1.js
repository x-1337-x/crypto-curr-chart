const request = require('supertest');
const app = require('../app');

afterAll(async () => {
    await app.get('db').sequelize.close();
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
            .expect(200)
            .then((r) => {
                expect(r.body).toBeDefined();
                expect(r.body.user).toBeDefined();
                expect(r.body.user).toMatchObject({
                    user_id: expect.any(Number),
                    email: 'aaa@bbb',
                    password: expect.any(String),
                });
            });
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
