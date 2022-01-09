import express from 'express';
import checkAuth from '../utils/checkAuth';
import { getDB } from '../utils/getDB';
export const votesRouter = express.Router();

votesRouter.use(checkAuth);

votesRouter.get('/', async (req, res, next) => {
    try {
        let votes = await getDB(req.app).query(
            `select * from votes where user_id = $1`,
            [res.locals.user_id]
        );
        res.json(votes);
    } catch (error) {
        return next(error);
    }
});

votesRouter.post('/:coinId', async (req, res, next) => {
    try {
        let result = await getDB(req.app).query(
            `insert into votes ("user_id", "coin_id", "date") values ($1, $2, $3) returning user_id, coin_id, date`,
            [res.locals.user_id, req.params.coinId, new Date()]
        );
        res.json({ msg: 'The vote has been added', vote: result[0] });
    } catch (error) {
        return next(error);
    }
});
