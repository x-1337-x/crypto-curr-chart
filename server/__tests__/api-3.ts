import request from 'supertest';
import { getConnection } from 'typeorm';
import app from '../app';
import { setupDB } from '../db_typeorm';

let token: string | null = null;
beforeAll(async () => {
    const connection = await setupDB('test');
    app.set('db2', connection);

    const response = await request(app)
        .post('/login')
        .send({ email: 'testuser@test', password: 'test' });

    token = response.body.token;
});

afterAll(async () => {
    await app.get('db').sequelize.close();
    await app.get('db2').close();
});

describe('API', function () {
    test('POST /protected 403 if no token', async function () {
        await request(app).post('/protected').expect(403);
    });

    test('POST /protected 403 if valid token but user doesnt exist', async function () {
        await request(app)
            .post('/protected')
            .send({
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJpYXQiOjE2NDEzMTkwMDcsImV4cCI6MTY0MTM0MDYwN30.Pzk2h-gT4foh_-P7GXIKGXL1VyXwjXXepWBZk67CkwI',
            })
            .expect(403);
    });

    test('POST /protected 200 if valid token', async function () {
        await request(app)
            .post('/protected')
            .send({
                token,
            })
            .expect(200);
    });
});
