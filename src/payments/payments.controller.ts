import { PaymentIntentsService } from './payment-intents.service';
import { PaymentsService } from './payments.service';
import { Body, Controller, Param, Post } from '@nestjs/common';

import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

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
  handleWebhook(@Body() body: any) {
    return this.paymentsService.handleGatewayWebhook(body);
  }
}
