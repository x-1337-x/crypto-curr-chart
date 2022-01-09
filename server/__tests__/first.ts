import checkAuth from '../utils/checkAuth';
import request from 'supertest';
import app from '../app';
import { Request, Response } from 'express';
import { setupDB } from '../db_typeorm';
import { getDB } from '../utils/getDB';

const dbMock = {
    query: jest.fn().mockReturnValue([{}]),
};

type RequestMock = {
    body: Record<string, any>;
    query: Record<string, any>;
    headers: Record<string, any>;
    app: {
        get(key: string): any;
    };
};

type ResponseMock = {
    status(status: number): ResponseMock;
    end: Function;
    json: Function;
    locals: Record<string, any>;
    statusCode: number;
};

const createRequestMock = (): RequestMock => {
    const req: RequestMock = {
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

const createResponseMock = (): ResponseMock => {
    const res: ResponseMock = {
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

const doneFunction = jest.fn();

let token: string | null = null;
beforeAll(async () => {
    const connection = await setupDB('test');

    app.set('db', connection);

    const response = await request(app)
        .post('/login')
        .send({ email: 'testuser@test', password: 'test' });

    token = response.body.token;
});

afterAll(async () => {
    await getDB(app).close();
});

beforeEach(() => {
    doneFunction.mockClear();
});

describe('checkAuth middleware', function () {
    test('request without token', function () {
        const req = createRequestMock();
        const res = createResponseMock();

        checkAuth(req as Request, res as Response, doneFunction);

        expect(res.statusCode).toBe(403);
        expect(doneFunction).not.toBeCalled();
    });

    test('request with forged token in body', function () {
        const req = createRequestMock();
        const res = createResponseMock();

        req.body.token = '12345678';

        checkAuth(req as Request, res as Response, doneFunction);

        expect(res.statusCode).toBe(403);
        expect(doneFunction).not.toBeCalled();
    });

    test('request with token in body', async function () {
        const req = createRequestMock();
        const res = createResponseMock();

        req.body.token = token;

        console.log({ token });

        await checkAuth(req as Request, res as Response, doneFunction);

        expect(res.statusCode).toBe(200);
        expect(doneFunction).toBeCalled();
    });
});
