export const JWT_OPTIONS = {
    expiresIn: '6h',
};

export const PORT = 3000;

export const DB_SETTINGS = {
    development: {
        type: 'postgres',
        entities: ['src/entity/**/*.ts'],
        migrations: ['src/migration/**/*.ts'],
        subscribers: ['src/subscriber/**/*.ts'],
        cli: {
            entitiesDir: 'src/entity',
            migrationsDir: 'src/migration',
            subscribersDir: 'src/subscriber',
        },
        port: 5432,
        username: 'nlxtikqohobtaw',
        password:
            'bec1fc294b909b7ad781b154e6a30f308103fecc0faa305a0e6caa4ba119e991',
        database: 'dcgfiajid84r98',
        host: 'ec2-34-247-118-233.eu-west-1.compute.amazonaws.com',
        synchronize: true,
        logging: true,
        ssl: true,
        extra: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    },
    test: {
        type: 'postgres',
        entities: ['src/entity/**/*.ts'],
        migrations: ['src/migration/**/*.ts'],
        subscribers: ['src/subscriber/**/*.ts'],
        cli: {
            entitiesDir: 'src/entity',
            migrationsDir: 'src/migration',
            subscribersDir: 'src/subscriber',
        },
        port: 5432,
        username: 'sjffjihmzhgsse',
        password:
            '09c730c2d6321324499e4534aba4442ccb569958112a70d43c14d92c8eed5995',
        database: 'da2dk46aq6p2oi',
        host: 'ec2-54-195-141-170.eu-west-1.compute.amazonaws.com',
        synchronize: true,
        logging: false,
        ssl: true,
        extra: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    },
};
