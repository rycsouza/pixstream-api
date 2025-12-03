import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { WalletAccount } from './wallet-account.entity';

export enum WithdrawStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

@Entity('withdraw_requests')
export class WithdrawRequest {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'wallet_account_id', type: 'bigint', unsigned: true })
  walletAccountId: string;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: WithdrawStatus,
    default: WithdrawStatus.PENDING,
  })
  status: WithdrawStatus;

  @CreateDateColumn({ name: 'requested_at', type: 'datetime' })
  requestedAt: Date;

  @Column({ name: 'processed_at', type: 'datetime', nullable: true })
  processedAt?: Date;

  @Column({
    name: 'admin_user_id',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  adminUserId?: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;


  @ManyToOne(() => WalletAccount, (wallet) => wallet.withdrawRequests, {
    onDelete: 'CASCADE',
  })
  walletAccount: WalletAccount;

  @ManyToOne(() => User, (user) => user.processedWithdrawRequests, {
    onDelete: 'SET NULL',
  })
  adminUser?: User;
}
