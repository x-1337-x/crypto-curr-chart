import { ConnectionOptions, createConnection } from 'typeorm';
import { DB_SETTINGS } from '../constants';

export const setupDB = async () => {
    const env = (process.env.NODE_ENV || 'development') as
        | 'development'
        | 'test';

    console.log({ env });

    await createConnection(DB_SETTINGS[env] as ConnectionOptions);
};
