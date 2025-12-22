import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlertsService } from 'src/alerts/alerts.service';
import { WalletService } from 'src/wallet/wallet.service';
import { Repository } from 'typeorm';

import { Payment, PaymentStatus } from './entities/payment.entity';
import { PAYMENT_GATEWAY } from './gateways/payment-gateway.provider';
import { PaymentIntentsService } from './payment-intents.service';

import type { IPaymentGateway } from './gateways/payment-gateway.interface';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly paymentIntentsService: PaymentIntentsService,
    private readonly walletService: WalletService,
    private readonly alertsService: AlertsService,

    @Inject(PAYMENT_GATEWAY)
    private readonly gateway: IPaymentGateway,
  ) {}

  async handleGatewayWebhook(body: any, headers: Record<string, any> = {}) {
    const { externalReference, status, amount } =
      await this.gateway.parseWebhook(body, headers);
    if (!externalReference)
      throw new BadRequestException('externalReference é obrigatório.');

    if (status !== PaymentStatus.CONFIRMED)
      return { ignored: true, reason: 'Status diferente de PAID' };

    const intent = await this.paymentIntentsService.findByExternalReference(
      externalReference,
    );
    if (!intent)
      throw new BadRequestException(
        'Tentativa de Pagamento não encontrada para o externalReference informado.',
      );

    const existing = await this.paymentRepository.findOne({
      where: { paymentIntentId: intent.id },
    });
    if (existing && existing.status === PaymentStatus.CONFIRMED)
      return { ignored: true, reason: 'Pagamento já processado' };

    const amountStr = Number(amount ?? intent.amount).toFixed(2);
    const payment = this.paymentRepository.create({
      paymentIntentId: intent.id,
      channelId: intent.channelId,
      userId: intent.channel.userId,
      gatewayPaymentId: externalReference,
      amount: amountStr,
      feeAmount: '0.00',
      netAmount: amountStr,
      status: PaymentStatus.CONFIRMED,
      paidAt: new Date(),
    });

    const savedPayment = await this.paymentRepository.save(payment);

    await this.walletService.creditFromPayment(savedPayment);
    await this.alertsService.enqueueAlertFromPayment(savedPayment, intent);

    return {
      ok: true,
      paymentId: savedPayment.id,
    };
  }
}
