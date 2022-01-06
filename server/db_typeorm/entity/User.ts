import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { CoinEntity } from './Coin';

export type User = {
    user_id: number;
    email: string;
    password: string;
};

export type UserCreateAttributes = Omit<User, 'user_id'>;

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    user_id!: number;

    @Column({
        unique: true,
    })
    email!: string;

    @Column()
    password!: string;

    @ManyToMany(() => CoinEntity)
    @JoinTable({
        name: 'watchlists',
        joinColumn: {
            name: 'user_id',
        },
        inverseJoinColumn: {
            name: 'coin_id',
        },
    })
    watchedCoins!: CoinEntity[];

    constructor(values: UserCreateAttributes) {
        super();

        Object.assign(this, values);
    }
}
