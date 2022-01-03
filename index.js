const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DB = require('./db/models');
const { QueryTypes } = require('sequelize');

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('secret', 'biliberda');

const jwtOptions = {
    expiresIn: '6h',
};

// DB.sequelize.sync({ force: false }).then(async () => {
// DONT DELETE ME PLEASE
// const result = await DB.sequelize.models.Coin.findAll({
//   raw: true,
//   group: ["Coin.id"],
//   includeIgnoreAttributes: false,
//   include: [
//     {
//       model: DB.sequelize.models.User,
//       as: "VoteUser",
//       attributes: [],
//     },
//   ],
//   attributes: {
//     include: [
//       [DB.sequelize.fn("COUNT", DB.sequelize.col("VoteUser.user_id")), "votes"],
//     ],
//   },
// });

app.listen(PORT, () => {
    console.log(`The app is listening at http://localhost:${PORT}`);
});
// });

app.post('/register', async (req, res) => {
    // try {
    // 	let users = await DB.User.findAll({
    // 		where: {
    // 			email: req.body.email,
    // 		},
    // 	});

    // 	if (users.length > 0) {
    // 		res.status(400).send('Registration failure');
    // 		return;
    // 	}
    // } catch (error) {
    // 	console.log(error);
    // 	res.status(500).end();
    // 	return;
    // }
    let { password, repeatPassword } = req.body;
    if (password !== repeatPassword) {
        res.status(400).send('Password does not match Repeat password');
        return;
    }

    try {
        let { email, password } = req.body;
        password = password = await bcrypt.hash(password, 10);
        const [results, metadata] = await DB.sequelize.query(
            `insert into users ("email", "password") values (:email, :password)`,
            {
                replacements: {
                    email,
                    password,
                },
            }
        );
        res.json({ results, metadata });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.get('/register', (req, res) => {
    res.send(`
    <form action="/register" method="post">
    <div>
        <label>
            Email<br/>
            <input type="email" name="email" required>
        </label>
    </div>
    <div>
        <label>
            Password<br/>
            <input type="password" name="password" required><br/>
        </label>
    </div>
    <div>
        <label>
            Repeat password<br/>
            <input type="password" name="repeatPassword" required><br/>
        </label>
    </div>
    <div>
        <button type="submit">Submit</button>
    </div>
  </form>
  `);
});

app.get('/login', (req, res) => {
    res.send(`
    <form action="/login" method="post">
    <div>
        <label>
            Email<br/>
            <input type="email" name="email" required>
        </label>
    </div>
    <div>
        <label>
            Password<br/>
            <input type="password" name="password" required><br/>
        </label>
    </div>
    <div>
        <button type="submit">LOGIN</button>
    </div>
  </form>
  `);
});

app.post('/login', async (req, res) => {
    try {
        // let user = await DB.User.findOne({
        //     where: {
        //         email: req.body.email,
        //     },
        // });
        const [user] = await DB.sequelize.query(
            `select * from users where email=:email`,
            {
                replacements: {
                    email: req.body.email,
                },
                type: QueryTypes.SELECT,
            }
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
                const payload = { user_id: user.user_id };

                const token = jwt.sign(
                    payload,
                    req.app.get('secret'),
                    jwtOptions
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

app.post('/validateToken', (req, res) => {
    const token = req.body.token || req.query.token || req.headers.token;

    jwt.verify(token, req.app.get('secret'), (err, decoded) => {
        if (err) {
            return res.status(400).json({ err: err.message });
        }

        const payload = { user_id: decoded.user_id };

        const token = jwt.sign(payload, req.app.get('secret'), jwtOptions);

        res.json({ token });
    });
});

const checkAuth = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers.token;

    if (!token) return res.status(403).end();

    jwt.verify(token, req.app.get('secret'), (err, decoded) => {
        if (err) {
            return res.status(403).json({ err: err.message });
        } else {
            res.locals.user_id = decoded.user_id;
            next();
        }
    });
};

app.use('/protected', checkAuth, (req, res) => {
    res.send(`Protected route data ${res.locals.user_id}`);
});

app.post('/api/coins', async (req, res) => {
    try {
        let { name, symbol, description } = req.body;
        let [coin] = await DB.sequelize.query(
            `insert into coins ("name", "symbol", "description") values (:name, :symbol, :description)`,
            {
                replacements: {
                    name,
                    symbol,
                    description,
                },
                type: QueryTypes.INSERT,
            }
        );
        res.send(coin);
    } catch (error) {
        console.log(error);
        res.status(500).end();
        return;
    }
});

app.get('/submit', (req, res) => {
    res.send(`
    <form action="/api/coins" method="post">
    <h1>ADD A COIN</h1>
    <div>
        <label>
            Coin Name<br/>
            <input type="text" name="name" required>
        </label>
    </div>
    <div>
        <label>
            Symbol<br/>
            <input type="text" name="symbol" required><br/>
        </label>
    </div>
    <div>
        <label>
            Description<br/>
            <textarea name="description" required></textarea>
        </label>
    </div>
    <div>
        <button type="submit">SUBMIT</button>
    </div>
  </form>
  `);
});

app.get('/api/coins/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let [coin] = await DB.sequelize.query(
            `select * from coins where coin_id=:id`,
            {
                replacements: {
                    id,
                },
                type: QueryTypes.SELECT,
            }
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
        await DB.sequelize.query(
            `update coins set name=:name, symbol=:symbol, description=:description where coin_id = :id`,
            {
                replacements: {
                    name,
                    symbol,
                    description,
                    id,
                },
                type: QueryTypes.UPDATE,
            }
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
        await DB.sequelize.query(`delete from coins where coin_id=:id`, {
            replacements: {
                id,
            },
            type: QueryTypes.DELETE,
        });
        res.end();
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.get('/api/coins', async (req, res) => {
    try {
        const [coins] = await DB.sequelize.query(`select * from coins`);
        res.json(coins);
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.get('/api/watchlist', checkAuth, async (req, res) => {
    try {
        // let watchlist = await DB.sequelize.models.Watchlist.findAll({
        //     where: {
        //         user_id: res.locals.user_id,
        //     },
        //     raw: true,
        // });
        // let coinIds = watchlist.map((el) => {
        //     return el.coin_id;
        // });
        // let coins = await DB.sequelize.models.Coin.findAll({
        //     where: {
        //         coin_id: {
        //             [DB.Sequelize.Op.in]: coinIds,
        //         },
        //     },
        // });
        let id = res.locals.user_id;
        let coins = await DB.sequelize.query(
            `select * from coins where coin_id in (select coin_id from watchlists where user_id=:id)`,
            {
                replacements: { id },
                type: QueryTypes.SELECT,
            }
        );
        res.json(coins);
        return;
    } catch (error) {
        console.log(error);
        sendStatus(500);
        return;
    }
});

app.post('/api/watchlist/:coinId', checkAuth, async (req, res) => {
    try {
        let entry = { user_id: res.locals.user_id, coin_id: req.params.coinId };
        await DB.sequelize.models.Watchlist.create(entry);
        res.send('The coin has been added to the watchlist');
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.delete('/api/watchlist/:coinId', checkAuth, async (req, res) => {
    try {
        await DB.sequelize.models.Watchlist.destroy({
            where: { coin_id: req.params.coinId, user_id: res.locals.user_id },
        });
        res.send('The coin has been removed from the watchlist');
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.get('/api/votes', checkAuth, async (req, res) => {
    try {
        let votes = await DB.sequelize.models.Vote.findAll({
            user_id: res.locals.user_id,
        });
        res.json(votes);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});

app.post('/api/votes/:coinId', checkAuth, async (req, res) => {
    try {
        let vote = await DB.sequelize.models.Vote.create({
            user_id: res.locals.user_id,
            coin_id: req.params.coinId,
            date: new Date().toDateString(),
        });
        res.json(vote);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
});
