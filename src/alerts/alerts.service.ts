import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, Subject } from 'rxjs';
import { PaymentIntent } from 'src/payments/entities/payment-intent.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Repository } from 'typeorm';

import { AlertEvent, AlertStatus } from './entities/alert-event.entity';

export interface SseMessageEvent {
  data: any;
  id?: string;
  type?: string;
  retry?: number;
}

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(AlertEvent)
    private readonly alertRepository: Repository<AlertEvent>,
  ) {}

  private channelStreams = new Map<string, Subject<SseMessageEvent>>();

  subscribeToChannel(channelId: string | number): Observable<SseMessageEvent> {
    const key = String(channelId);

    let subject = this.channelStreams.get(key);
    if (!subject) {
      subject = new Subject<SseMessageEvent>();
      this.channelStreams.set(key, subject);
    }

    return subject.asObservable();
  }

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

    const saved = await this.alertRepository.save(event);

    const key = String(payment.channelId);
    const stream = this.channelStreams.get(key);
    stream?.next({
      data: {
        id: saved.id,
        channelId: saved.channelId,
        paymentId: saved.paymentId,
        donorName: saved.donorName,
        donorMessage: saved.donorMessage,
        amount: saved.amount,
        createdAt: saved.createdAt,
      },
      type: 'new_alert',
    });

    return saved;
  }
}
