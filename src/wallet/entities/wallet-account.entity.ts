import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { WalletTransaction } from './wallet-transaction.entity';
import { WithdrawRequest } from './withdraw-request.entity';

@Entity('wallet_accounts')
export class WalletAccount {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true, unique: true })
  userId: string;

  @Column({
    name: 'balance',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  balance: string;

  @Column({ name: 'currency', type: 'char', length: 3, default: 'BRL' })
  currency: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;


  @OneToOne(() => User, (user) => user.walletAccount, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => WalletTransaction, (tx) => tx.walletAccount)
  transactions: WalletTransaction[];

  @OneToMany(() => WithdrawRequest, (wr) => wr.walletAccount)
  withdrawRequests: WithdrawRequest[];
}
