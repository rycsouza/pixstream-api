import { Body, Controller, Headers, Param, Post } from '@nestjs/common';

import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PaymentIntentsService } from './payment-intents.service';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(
    private readonly paymentIntentsService: PaymentIntentsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post('channels/:slug/payment-intents')
  createIntent(
    @Param('slug') slug: string,
    @Body() dto: CreatePaymentIntentDto,
  ) {
    return this.paymentIntentsService.createForChannelSlug(slug, dto);
  }

  @Post('payments/webhook')
  handleWebhook(@Body() body: any, @Headers() headers: Record<string, any>) {
    return this.paymentsService.handleGatewayWebhook(body, headers);
  }
}
