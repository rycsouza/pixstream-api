import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelsService } from 'src/channels/channels.service';
import { Repository } from 'typeorm';

import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import {
  PaymentIntent,
  PaymentIntentStatus,
} from './entities/payment-intent.entity';
import { PaymentGatewayService } from './payment-gateway.service';

@Injectable()
export class PaymentIntentsService {
  constructor(
    @InjectRepository(PaymentIntent)
    private paymentIntentsRepository: Repository<PaymentIntent>,
    private channelsService: ChannelsService,
    private readonly gatewayService: PaymentGatewayService,
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

    const pixCharge = await this.gatewayService.createPixCharge({
      amount: dto.amount,
      reference: `PSTR-${channel.id}`,
      expirationInMinutes: 30,
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
      qrcode: pixCharge.qrcode,
      txid: pixCharge.txid,
    };
  }

  async findByExternalReference(externalReference: string) {
    if (!externalReference) return null;

    return this.paymentIntentsRepository.findOne({
      where: { externalReference },
      relations: ['channel'],
    });
  }
}
