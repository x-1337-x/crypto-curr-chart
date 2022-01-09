import { Connection } from 'typeorm';
import type { Application } from 'express';

export const getDB = (app: Application): Connection => {
    return app.get('db') as Connection;
};
