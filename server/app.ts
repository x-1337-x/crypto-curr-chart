import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { apiRouter } from './routes/api';
import { errorHandler } from './utils/errorHandler';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// TODO: move to env
app.set('secret', 'biliberda');

app.use(authRouter);
app.use('/api', apiRouter);

app.use(errorHandler);

export default app;
