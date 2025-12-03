import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Channel } from '../../channels/entities/channel.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum AlertStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

@Entity('alert_events')
export class AlertEvent {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'channel_id', type: 'bigint', unsigned: true })
  channelId: string;

  @Column({ name: 'payment_id', type: 'bigint', unsigned: true })
  paymentId: string;

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
    name: 'amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: AlertStatus,
    default: AlertStatus.PENDING,
  })
  status: AlertStatus;

  @Column({ name: 'attempts', type: 'int', unsigned: true, default: 0 })
  attempts: number;

  @Column({ name: 'last_attempt_at', type: 'datetime', nullable: true })
  lastAttemptAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @ManyToOne(() => Channel, (channel) => channel.alertEvents, {
    onDelete: 'CASCADE',
  })
  channel: Channel;

  @ManyToOne(() => Payment, (payment) => payment.alertEvents, {
    onDelete: 'CASCADE',
  })
  payment: Payment;
}
