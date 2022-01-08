import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { DB_SETTINGS } from '../constants';
import { CoinEntity } from './entity/Coin';
import { UserEntity } from './entity/User';
import { VoteEntity } from './entity/Vote';

const entities = [UserEntity, CoinEntity, VoteEntity];

export const setupDB = async (name: string = 'app'): Promise<Connection> => {
    const env = (process.env.NODE_ENV || 'development') as
        | 'development'
        | 'test';

    const connection = await createConnection({
        name,
        entities,
        ...(DB_SETTINGS[env] as ConnectionOptions),
    });

    return connection;
};
