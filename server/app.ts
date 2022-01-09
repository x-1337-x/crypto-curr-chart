import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { JWT_OPTIONS } from './constants';
import checkAuth from './utils/checkAuth';
import type { AuthTokenPayload } from './types';
import { getDB } from './utils/getDB';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('secret', 'biliberda');

app.post('/register', async (req, res) => {
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

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await getDB(app).query(
            `insert into users ("email", "password") values ($1, $2) returning user_id, email, password`,
            [email, hashedPassword]
        );

        res.end();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.post('/login', async (req, res) => {
    try {
        const [user] = await getDB(app).query(
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
        console.log(error);
        res.status(500);
        return;
    }
});

app.post('/validateToken', checkAuth, (req, res) => {
    const payload: AuthTokenPayload = { user_id: res.locals.user_id };
    const token = jwt.sign(payload, req.app.get('secret'), JWT_OPTIONS);

    res.json({ token });
});

app.get('/api/coins', async (req, res) => {
    try {
        const coins = await getDB(app).query(`select * from coins`);
        res.json(coins);
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.post('/api/coins', async (req, res) => {
    try {
        let { name, symbol, description } = req.body;
        let [coin] = await getDB(app).query(
            `insert into coins ("name", "symbol", "description") values ($1, $2, $3)`,
            [name, symbol, description]
        );
        res.send(coin);
    } catch (error) {
        console.log(error);
        res.status(500).end();
        return;
    }
});

app.get('/api/coins/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let [coin] = await getDB(app).query(
            `select * from coins where coin_id = $1`,
            [id]
        );
        if (!coin) {
            res.sendStatus(404);
            return;
        }
        res.json(coin);
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.put('/api/coins/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let { name, symbol, description } = req.body;
        await getDB(app).query(
            `update coins set name=$1, symbol=$2, description=$3 where coin_id = $4`,
            [name, symbol, description, id]
        );
        res.end();
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.delete('/api/coins/:id', async (req, res) => {
    try {
        let id = req.params.id;
        await getDB(app).query(`delete from coins where coin_id = $1`, [id]);
        res.end();
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.get('/api/watchlist', checkAuth, async (req, res) => {
    try {
        let id = res.locals.user_id;
        let coins = await getDB(app).query(
            `select * from coins where coin_id in (select coin_id from watchlists where user_id = $1)`,
            [id]
        );
        res.json(coins);
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.post('/api/watchlist/:coinId', checkAuth, async (req, res) => {
    try {
        let result = await getDB(app).query(
            `insert into watchlists ("user_id", "coin_id") values ($1, $2) RETURNING user_id, coin_id`,
            [res.locals.user_id, req.params.coinId]
        );
        res.json({
            msg: 'The coin has been added to the watchlist',
            coin: result[0],
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.delete('/api/watchlist/:coinId', checkAuth, async (req, res) => {
    try {
        await getDB(app).query(
            `delete from watchlists where coin_id = $1 and user_id = $2 RETURNING user_id, coin_id`,
            [req.params.coinId, res.locals.user_id]
        );
        res.json({
            msg: 'The coin has been removed from the watchlist',
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.get('/api/votes', checkAuth, async (req, res) => {
    try {
        let votes = await getDB(app).query(
            `select * from votes where user_id = $1`,
            [res.locals.user_id]
        );
        res.json(votes);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.post('/api/votes/:coinId', checkAuth, async (req, res) => {
    try {
        let result = await getDB(app).query(
            `insert into votes ("user_id", "coin_id", "date") values ($1, $2, $3) returning user_id, coin_id, date`,
            [res.locals.user_id, req.params.coinId, new Date()]
        );
        res.json({ msg: 'The vote has been added', vote: result[0] });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

export default app;
