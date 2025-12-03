import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { WalletAccount } from './wallet-account.entity';

export enum WalletTransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum WalletTransactionSourceType {
  PAYMENT = 'PAYMENT',
  WITHDRAWAL = 'WITHDRAWAL',
  ADJUSTMENT = 'ADJUSTMENT',
  REFUND = 'REFUND',
}

@Entity('wallet_transactions')
export class WalletTransaction {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'wallet_account_id', type: 'bigint', unsigned: true })
  walletAccountId: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: WalletTransactionType,
  })
  type: WalletTransactionType;

  @Column({
    name: 'source_type',
    type: 'enum',
    enum: WalletTransactionSourceType,
  })
  sourceType: WalletTransactionSourceType;

  @Column({ name: 'source_id', type: 'bigint', unsigned: true, nullable: true })
  sourceId?: string;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: string;

  @Column({
    name: 'balance_before',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  balanceBefore: string;

  @Column({
    name: 'balance_after',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  balanceAfter: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;


  @ManyToOne(() => WalletAccount, (wallet) => wallet.transactions, {
    onDelete: 'CASCADE',
  })
  walletAccount: WalletAccount;
}
