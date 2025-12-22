import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MercadoPagoGateway } from './mercado-pago.gateway';
import { IPaymentGateway } from './payment-gateway.interface';

export const PAYMENT_GATEWAY = 'PAYMENT_GATEWAY';

export const PaymentGatewayProvider: Provider = {
  provide: PAYMENT_GATEWAY,
  inject: [ConfigService],
  useFactory: (config: ConfigService): IPaymentGateway => {
    const provider = config.get<string>(
      'PAYMENT_GATEWAY_PROVIDER',
      'mercadopago',
    );

    const providers = {
      mercadopago: new MercadoPagoGateway(),
    }[provider];

    return providers!;
  },
};
