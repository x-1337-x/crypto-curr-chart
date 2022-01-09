import express from 'express';
import { JWT_OPTIONS } from '../constants';
import { AuthTokenPayload } from '../types';
import checkAuth from '../utils/checkAuth';
import { getDB } from '../utils/getDB';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
export const authRouter = express.Router();

authRouter.post('/register', async (req, res, next) => {
    try {
        let { email, password, repeatPassword } = req.body;

        if (!email || !password || !repeatPassword) {
            res.status(400).send(
                'Email, password, repeatedPassword are required fields'
            );
            return;
        }

        if (password !== repeatPassword) {
            res.status(400).send('Password does not match Repeat password');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await getDB(req.app).query(
            `insert into users ("email", "password") values ($1, $2) returning user_id, email, password`,
            [email, hashedPassword]
        );

        res.end();
    } catch (error) {
        return next(error);
    }
});

authRouter.post('/login', async (req, res, next) => {
    try {
        const [user] = await getDB(req.app).query(
            `select * from users where email = $1`,
            [req.body.email]
        );

        if (!user) {
            res.status(400).send('Wrong email or password');
            return;
        } else {
            const match = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (match) {
                const payload: AuthTokenPayload = { user_id: user.user_id };

                const token = jwt.sign(
                    payload,
                    req.app.get('secret'),
                    JWT_OPTIONS
                );

                res.json({ token });
                return;
            } else {
                res.status(400).send('Wrong email or password');
                return;
            }
        }
    } catch (error) {
        return next(error);
    }
});

authRouter.post('/validateToken', checkAuth, (req, res) => {
    const payload: AuthTokenPayload = { user_id: res.locals.user_id };
    const token = jwt.sign(payload, req.app.get('secret'), JWT_OPTIONS);

    res.json({ token });
});
