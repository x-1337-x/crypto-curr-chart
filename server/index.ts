import app from './app';

import { PORT } from './constants';

app.listen(PORT, function () {
    console.log(`app is running at http://localhost:${PORT}`);
});
