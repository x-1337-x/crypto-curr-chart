const express = require('express');
const cors = require('cors');
const DB = require('./db/models');

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
		await DB.User.create(req.body);
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
			if (user.password === req.body.password) {
				res.send('Login successful');
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
