const request = require('supertest');
const app = require('../app');

let token = null;
beforeAll(async () => {
    await request(app).post('/register').send({
        email: 'testuser@test',
        password: 'test',
        repeatPassword: 'test',
    });
    const response = await request(app)
        .post('/login')
        .send({ email: 'testuser@test', password: 'test' });

    token = response.body.token;
});

afterAll(async () => {
    await app
        .get('db')
        .sequelize.query("delete from users where email = 'testuser@test'");
    await app.get('db').sequelize.close();
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
