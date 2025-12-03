import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { AlertEvent } from '../../alerts/entities/alert-event.entity';
import { Channel } from '../../channels/entities/channel.entity';
import { User } from '../../users/entities/user.entity';
import { PaymentIntent } from './payment-intent.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CHARGEBACK = 'CHARGEBACK',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'payment_intent_id', type: 'bigint', unsigned: true })
  paymentIntentId: string;

  @Column({ name: 'channel_id', type: 'bigint', unsigned: true })
  channelId: string;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: string;

  @Column({
    name: 'gateway_payment_id',
    type: 'varchar',
    length: 128,
    unique: true,
  })
  gatewayPaymentId: string;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: string;

  @Column({
    name: 'fee_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  feeAmount: string;

  @Column({
    name: 'net_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  netAmount: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ name: 'paid_at', type: 'datetime', nullable: true })
  paidAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @OneToOne(() => PaymentIntent, (pi) => pi.payment, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'payment_intent_id' })
  paymentIntent: PaymentIntent;

  @ManyToOne(() => Channel, (channel) => channel.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => AlertEvent, (ae) => ae.payment)
  alertEvents: AlertEvent[];
}
