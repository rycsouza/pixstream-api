import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { AlertEvent } from '../../alerts/entities/alert-event.entity';
import { PaymentIntent } from '../../payments/entities/payment-intent.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { User } from '../../users/entities/user.entity';

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'slug', type: 'varchar', length: 60, unique: true })
  slug: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'widget_token', type: 'char', length: 36, unique: true })
  widgetToken: string;

  @Column({ name: 'is_active', type: 'tinyint', width: 1, default: 1 })
  isActive: boolean;

  @Column({
    name: 'min_alert_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  minAlertAmount: string;

  @Column({ name: 'show_donor_name', type: 'tinyint', width: 1, default: 1 })
  showDonorName: boolean;

  @Column({ name: 'default_message', type: 'varchar', length: 255, nullable: true })
  defaultMessage?: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.channels, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => PaymentIntent, (pi) => pi.channel)
  paymentIntents: PaymentIntent[];

  @OneToMany(() => Payment, (p) => p.channel)
  payments: Payment[];

  @OneToMany(() => AlertEvent, (ae) => ae.channel)
  alertEvents: AlertEvent[];
}
