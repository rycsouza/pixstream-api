import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlertsModule } from '../alerts/alerts.module';
import { ChannelsModule } from '../channels/channels.module';
import { WalletModule } from '../wallet/wallet.module';
import { PaymentIntent } from './entities/payment-intent.entity';
import { Payment } from './entities/payment.entity';
import { MercadoPagoGateway } from './gateways/mercado-pago.gateway';
import { PaymentGatewayProvider } from './gateways/payment-gateway.provider';
import { PaymentIntentsService } from './payment-intents.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([PaymentIntent, Payment]),
    ChannelsModule,
    WalletModule,
    AlertsModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentIntentsService,
    MercadoPagoGateway,
    PaymentGatewayProvider,
  ],
  exports: [PaymentsService, PaymentIntentsService],
})
export class PaymentsModule {}
