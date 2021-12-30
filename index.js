const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DB = require('./db/models');

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('secret', 'biliberda');

const jwtOptions = {
	expiresIn: '6h',
};

DB.sequelize.sync({ force: false }).then(async () => {
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
	//       [DB.sequelize.fn("COUNT", DB.sequelize.col("VoteUser.id")), "votes"],
	//     ],
	//   },
	// });

	app.listen(PORT, () => {
		console.log(`The app is listening at http://localhost:${PORT}`);
	});
});

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
		let user = req.body;
		user.password = await bcrypt.hash(user.password, 10);
		let dbUser = await DB.User.create(user);
		res.send('User created');
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
		let user = await DB.User.findOne({
			where: {
				email: req.body.email,
			},
		});
		if (!user) {
			res.status(400).send('Wrong email or password');
			return;
		} else {
			const match = await bcrypt.compare(req.body.password, user.password);
			if (match) {
				const payload = { userId: user.id };

				const token = jwt.sign(payload, req.app.get('secret'), jwtOptions);

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

		const payload = { userId: decoded.userId };

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
			res.locals.userId = decoded.userId;
			next();
		}
	});
};

app.use('/protected', checkAuth, (req, res) => {
	res.send(`Protected route data ${res.locals.userId}`);
});

app.post('/api/coins', async (req, res) => {
	try {
		let coin = await DB.Coin.create(req.body);
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
		let coin = await DB.Coin.findByPk(req.params.id);
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
		await DB.Coin.update(req.body, {
			where: {
				id: req.params.id,
			},
		});
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
		await DB.Coin.destroy({
			where: {
				id: req.params.id,
			},
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
		const coins = await DB.Coin.findAll();
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
		let watchlist = await DB.sequelize.models.Watchlist.findAll({
			where: {
				userId: res.locals.userId,
			},
			raw: true,
		});
		let coinIds = watchlist.map((el) => {
			return el.coinId;
		});
		let coins = await DB.sequelize.models.Coin.findAll({
			where: {
				id: {
					[DB.Sequelize.Op.in]: coinIds,
				},
			},
		});
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
		let entry = { userId: res.locals.userId, coinId: req.params.coinId };
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
			where: { coinId: req.params.coinId, userId: res.locals.userId },
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
			userId: res.locals.userId,
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
			userId: res.locals.userId,
			coinId: req.params.coinId,
			date: new Date().toDateString(),
		});
		res.json(vote);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
		return;
	}
});
