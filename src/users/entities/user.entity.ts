import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Channel } from '../../channels/entities/channel.entity';
import { WalletAccount } from '../../wallet/entities/wallet-account.entity';
import { WithdrawRequest } from '../../wallet/entities/withdraw-request.entity';

export enum UserRole {
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'avatar_url', type: 'varchar', length: 512, nullable: true })
  avatarUrl?: string;

  @Column({ name: 'bio', type: 'text', nullable: true })
  bio?: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.CREATOR,
  })
  role: UserRole;

  @Column({ name: 'is_active', type: 'tinyint', width: 1, default: 1 })
  isActive: boolean;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;


  @OneToMany(() => Channel, (channel) => channel.user)
  channels: Channel[];

  @OneToOne(() => WalletAccount, (wallet) => wallet.user)
  walletAccount: WalletAccount;

  @OneToMany(() => WithdrawRequest, (wr) => wr.adminUser)
  processedWithdrawRequests: WithdrawRequest[];
}
