import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentIntent } from 'src/payments/entities/payment-intent.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Repository } from 'typeorm';

import { AlertEvent, AlertStatus } from './entities/alert-event.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(AlertEvent)
    private readonly alertRepository: Repository<AlertEvent>,
  ) {}

  async enqueueAlertFromPayment(payment: Payment, intent: PaymentIntent) {
    const event = this.alertRepository.create({
      channelId: payment.channelId,
      paymentId: payment.id,
      donorName: intent.donorName,
      donorMessage: intent.donorMessage,
      amount: payment.amount,
      status: AlertStatus.PENDING,
      attempts: 0,
    });

    return await this.alertRepository.save(event);
  }
}
