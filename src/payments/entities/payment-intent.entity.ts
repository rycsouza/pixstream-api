import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Channel } from '../../channels/entities/channel.entity';
import { Payment } from './payment.entity';

export enum PaymentIntentStatus {
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Entity('payment_intents')
export class PaymentIntent {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'channel_id', type: 'bigint', unsigned: true })
  channelId: string;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: string;

  @Column({ name: 'currency', type: 'char', length: 3, default: 'BRL' })
  currency: string;

  @Column({ name: 'donor_name', type: 'varchar', length: 255, nullable: true })
  donorName?: string;

  @Column({
    name: 'donor_message',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  donorMessage?: string;

  @Column({
    name: 'external_reference',
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  externalReference?: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PaymentIntentStatus,
    default: PaymentIntentStatus.PENDING,
  })
  status: PaymentIntentStatus;

  @Column({ name: 'expires_at', type: 'datetime', nullable: true })
  expiresAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @ManyToOne(() => Channel, (channel) => channel.paymentIntents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;

  @OneToOne(() => Payment, (payment) => payment.paymentIntent)
  payment: Payment;
}
