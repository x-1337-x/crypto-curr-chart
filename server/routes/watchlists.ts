import express from 'express';
import checkAuth from '../utils/checkAuth';
import { getDB } from '../utils/getDB';
export const watchlistRouter = express.Router();

watchlistRouter.use(checkAuth);

watchlistRouter.route('/').get(async (req, res, next) => {
    try {
        let id = res.locals.user_id;
        let coins = await getDB(req.app).query(
            `select * from coins where coin_id in (select coin_id from watchlists where user_id = $1)`,
            [id]
        );
        res.json(coins);
        return;
    } catch (error) {
        return next(error);
    }
});

watchlistRouter
    .route('/:coinId')
    .post(async (req, res, next) => {
        try {
            let result = await getDB(req.app).query(
                `insert into watchlists ("user_id", "coin_id") values ($1, $2) RETURNING user_id, coin_id`,
                [res.locals.user_id, req.params.coinId]
            );
            res.json({
                msg: 'The coin has been added to the watchlist',
                coin: result[0],
            });
        } catch (error) {
            return next(error);
        }
    })
    .delete(async (req, res, next) => {
        try {
            await getDB(req.app).query(
                `delete from watchlists where coin_id = $1 and user_id = $2 RETURNING user_id, coin_id`,
                [req.params.coinId, res.locals.user_id]
            );
            res.json({
                msg: 'The coin has been removed from the watchlist',
            });
        } catch (error) {
            return next(error);
        }
    });
