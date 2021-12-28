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

DB.sequelize.sync({ force: false }).then(() => {
	app.listen(PORT, () => {
		console.log(`The app is listening at http://localhost:${PORT}`);
	});
});

app.post('/register', async (req, res) => {
	try {
		let users = await DB.User.findAll({
			where: {
				email: req.body.email,
			},
		});

		if (users.length > 0) {
			res.status(400).send('Registration failure');
			return;
		}
	} catch (error) {
		res.status(500).end();
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
