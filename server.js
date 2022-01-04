const app = require('./app');

const { PORT } = require('./constants');

app.listen(PORT, function () {
    console.log(`app is running at http://localhost:${PORT}`);
});
