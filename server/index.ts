import app from './app';

import { PORT } from './constants';
import { setupDB } from './db_typeorm';

setupDB('app').then((connection) => {
    app.set('db', connection);
    app.listen(PORT, function () {
        console.log(`app is running at http://localhost:${PORT}`);
    });
});
