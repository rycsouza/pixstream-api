import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentIntentsService } from './payment-intents.service';
import { PaymentIntent } from './entities/payment-intent.entity';
import { Payment } from './entities/payment.entity';
import { ChannelsModule } from '../channels/channels.module';
import { WalletModule } from '../wallet/wallet.module';
import { AlertsModule } from '../alerts/alerts.module';
import { PaymentGatewayService } from './payment-gateway.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentIntent, Payment]),
    ChannelsModule,
    WalletModule,
    AlertsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentIntentsService, PaymentGatewayService],
  exports: [PaymentsService, PaymentIntentsService],
})
export class PaymentsModule {}
