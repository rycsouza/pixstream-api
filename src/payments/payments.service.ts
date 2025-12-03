import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlertsService } from 'src/alerts/alerts.service';
import { WalletService } from 'src/wallet/wallet.service';
import { Repository } from 'typeorm';

import { Payment, PaymentStatus } from './entities/payment.entity';
import { PaymentIntentsService } from './payment-intents.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly paymentIntentsService: PaymentIntentsService,
    private readonly walletService: WalletService,
    private readonly alertsService: AlertsService,
  ) {}

  async handleGatewayWebhook(body: any) {
    const { externalReference, status, id } = body;
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

    const amountStr = Number(intent.amount).toFixed(2);
    const payment = this.paymentRepository.create({
      paymentIntentId: intent.id,
      channelId: intent.channelId,
      userId: intent.channel.userId,
      gatewayPaymentId: id ?? externalReference,
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
