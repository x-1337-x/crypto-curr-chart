const checkAuth = require('../utils/checkAuth');
const { JWT_OPTIONS } = require('../constants');
const jwt = require('jsonwebtoken');

const createRequestMock = () => {
    const req = {
        body: {},
        query: {},
        headers: {},
        app: {
            get: jest.fn().mockImplementation(function (key) {
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

const generateToken = (req) => {
    const payload = { user_id: 1 };

    const token = jwt.sign(payload, req.app.get('secret'), JWT_OPTIONS);

    return token;
};

const doneFunction = jest.fn();

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

    test('request with token in body', function () {
        const req = createRequestMock();
        const res = createResponseMock();

        req.body.token = generateToken(req);

        checkAuth(req, res, doneFunction);

        expect(res.statusCode).toBe(200);
        expect(doneFunction).toBeCalled();
    });
});
