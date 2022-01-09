import express from 'express';
import { coinsRouter } from './coins';
import { votesRouter } from './votes';
import { watchlistRouter } from './watchlists';
export const apiRouter = express.Router();

apiRouter.use('/coins', coinsRouter);
apiRouter.use('/watchlist', watchlistRouter);
apiRouter.use('/votes', votesRouter);
