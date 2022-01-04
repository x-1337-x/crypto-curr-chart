const checkAuth = require('../utils/checkAuth');
const request = require('supertest');
const app = require('../app');

const modelMock = {
    findByPk: jest.fn().mockReturnValue({}),
};

const dbMock = {
    User: modelMock,
};

const createRequestMock = () => {
    const req = {
        body: {},
        query: {},
        headers: {},
        app: {
            get: jest.fn().mockImplementation(function (key) {
                if (key === 'db') {
                    return dbMock;
                }

                if (app.get(key)) {
                    return app.get(key);
                }

                return `app-get-${key}`;
            }),
        },
    };

    return req;
};

const createResponseMock = () => {
    const res = {
        status: jest.fn().mockImplementation(function (status) {
            res.statusCode = status;
            return res;
        }),
        end: jest.fn(),
        json: jest.fn(),
        locals: {},
        statusCode: 200,
    };

    return res;
};

const doneFunction = jest.fn().mockImplementation(() => {
    console.log('DONE DONE DONE');
});

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

beforeEach(() => {
    doneFunction.mockClear();
});

describe('checkAuth middleware', function () {
    test('request without token', function () {
        const req = createRequestMock();
        const res = createResponseMock();

        checkAuth(req, res, doneFunction);

        expect(res.statusCode).toBe(403);
        expect(doneFunction).not.toBeCalled();
    });

    test('request with forged token in body', function () {
        const req = createRequestMock();
        const res = createResponseMock();

        req.body.token = '12345678';

        checkAuth(req, res, doneFunction);

        expect(res.statusCode).toBe(403);
        expect(doneFunction).not.toBeCalled();
    });

    test('request with token in body', async function () {
        const req = createRequestMock();
        const res = createResponseMock();

        req.body.token = token;

        await checkAuth(req, res, doneFunction);

        expect(res.statusCode).toBe(200);
        expect(doneFunction).toBeCalled();
    });
});
