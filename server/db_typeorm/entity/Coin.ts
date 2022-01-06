import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

export type Coin = {
    coin_id: number;
    name: string;
    symbol: string;
    description?: string;
};

export type CoinCreateAttributes = Omit<Coin, 'coin_id'>;

@Entity({ name: 'coins' })
export class CoinEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    coin_id!: number;

    @Column({
        unique: true,
    })
    name!: string;

    @Column({
        unique: true,
    })
    symbol!: string;

    @Column({ nullable: true })
    description?: string;

    constructor(values: CoinCreateAttributes) {
        super();

        Object.assign(this, values);
    }
}
