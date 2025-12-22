import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelsService } from 'src/channels/channels.service';
import { Repository } from 'typeorm';

import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import {
  PaymentIntent,
  PaymentIntentStatus,
} from './entities/payment-intent.entity';

import type { IPaymentGateway } from './gateways/payment-gateway.interface';
import { PAYMENT_GATEWAY } from './gateways/payment-gateway.provider';

@Injectable()
export class PaymentIntentsService {
  constructor(
    @InjectRepository(PaymentIntent)
    private readonly paymentIntentsRepository: Repository<PaymentIntent>,
    private readonly channelsService: ChannelsService,
    @Inject(PAYMENT_GATEWAY)
    private readonly gateway: IPaymentGateway,
  ) {}

  async createForChannelSlug(slug: string, dto: CreatePaymentIntentDto) {
    const channel = await this.channelsService.findBySlug(slug);
    if (!channel?.isActive)
      throw new BadRequestException('Canal não encontrado.');

    const paymentIntent = this.paymentIntentsRepository.create({
      channelId: channel.id,
      amount: dto.amount.toFixed(2),
      currency: 'BRL',
      donorName: dto.donorName,
      donorMessage: dto.donorMessage,
      status: PaymentIntentStatus.PENDING,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });
    await this.paymentIntentsRepository.save(paymentIntent);

    const pixCharge = await this.gateway.createPixCharge({
      amount: dto.amount,
      reference: `PSTR-${paymentIntent.id}`,
      currency: 'BRL',
      description: `Doação para o canal ${channel.name}`,
    });

    paymentIntent.externalReference = pixCharge.txid;
    await this.paymentIntentsRepository.save(paymentIntent);

    return {
      id: paymentIntent.id,
      amount: Number(paymentIntent.amount),
      currency: paymentIntent.currency,
      donorName: paymentIntent.donorName,
      donorMessage: paymentIntent.donorMessage,
      status: paymentIntent.status,
      expiresAt: paymentIntent.expiresAt,
      qrcode: pixCharge.qrCode,
      txid: pixCharge.txid,
    };
  }

  async findByExternalReference(externalReference: string) {
    if (!externalReference) return null;
    externalReference = externalReference.split('-')[1] ?? externalReference;

    return this.paymentIntentsRepository.findOne({
      where: { id: externalReference },
      relations: ['channel'],
    });
  }
}
