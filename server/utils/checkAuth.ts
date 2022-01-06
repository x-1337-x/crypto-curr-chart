import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthTokenPayload } from '../types';

export default async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token || req.query.token || req.headers.token;

    if (!token) return res.status(403).end();

    try {
        const decoded = (await jwt.verify(
            token,
            req.app.get('secret')
        )) as AuthTokenPayload;

        const user = await req.app.get('db').User.findByPk(decoded.user_id);

        if (!user) {
            return res.status(403).end();
        }

        res.locals.user_id = decoded.user_id;

        next();
    } catch (err: any) {
        return res.status(403).json({ err: err.message });
    }
};
