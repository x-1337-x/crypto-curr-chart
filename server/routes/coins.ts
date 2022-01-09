import { getDB } from '../utils/getDB';
import express from 'express';
export const coinsRouter = express.Router();

coinsRouter
    .route('/')
    .get(async (req, res, next) => {
        try {
            const coins = await getDB(req.app).query(`select * from coins`);
            res.json(coins);
            return;
        } catch (error) {
            next(error);
        }
    })
    .post(async (req, res, next) => {
        try {
            let { name, symbol, description } = req.body;
            let [coin] = await getDB(req.app).query(
                `insert into coins ("name", "symbol", "description") values ($1, $2, $3)`,
                [name, symbol, description]
            );
            res.send(coin);
        } catch (error) {
            return next(error);
        }
    });

coinsRouter
    .route('/:id')
    .get(async (req, res, next) => {
        try {
            let id = req.params.id;
            let [coin] = await getDB(req.app).query(
                `select * from coins where coin_id = $1`,
                [id]
            );
            if (!coin) {
                res.sendStatus(404);
                return;
            }
            res.json(coin);
            return;
        } catch (error) {
            return next(error);
        }
    })
    .put(async (req, res, next) => {
        try {
            let id = req.params.id;
            let { name, symbol, description } = req.body;
            await getDB(req.app).query(
                `update coins set name=$1, symbol=$2, description=$3 where coin_id = $4`,
                [name, symbol, description, id]
            );
            res.end();
            return;
        } catch (error) {
            return next(error);
        }
    })
    .delete(async (req, res, next) => {
        try {
            let id = req.params.id;
            await getDB(req.app).query(`delete from coins where coin_id = $1`, [
                id,
            ]);
            res.end();
            return;
        } catch (error) {
            return next(error);
        }
    });
