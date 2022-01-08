import { setupDB } from './server/db_typeorm';
import request from 'supertest';
import app from './server/app';

export default async () => {
    const connection = await setupDB('global_test');
    await connection.synchronize(true);

    app.set('db2', connection);

    await request(app).post('/register').send({
        email: 'testuser@test',
        password: 'test',
        repeatPassword: 'test',
    });

    await connection.close();
};
