const app = require('./app');

const PORT = 3000;

app.listen(PORT, function () {
    console.log(`app is running at http://localhost:${PORT}`);
});
