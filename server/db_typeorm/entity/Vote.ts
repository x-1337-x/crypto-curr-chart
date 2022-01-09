import { Entity, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { CoinEntity } from './Coin';
import { UserEntity } from './User';

export type Vote = {
    coin_id: number;
    user_id: number;
    date: string;
};

@Entity({ name: 'votes' })
export class VoteEntity extends BaseEntity {
    @Column({ primary: true, type: 'date' })
    date!: string;

    @Column({ primary: true })
    @ManyToOne(() => UserEntity, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
    user_id!: UserEntity;

    @Column({ primary: true })
    @ManyToOne(() => CoinEntity, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'coin_id', referencedColumnName: 'coin_id' })
    coin_id!: CoinEntity;

    constructor(values: Vote) {
        super();

        Object.assign(this, values);
    }
}
