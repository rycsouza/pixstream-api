import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

import {
  CreatePixChargeInput,
  CreatePixChargeOutput,
  IPaymentGateway,
  ParsedWebhook,
} from './payment-gateway.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class MercadoPagoGateway implements IPaymentGateway {
  private readonly logger = new Logger(MercadoPagoGateway.name);
  private readonly api = axios.create({
    baseURL: 'https://api.mercadopago.com',
    timeout: 10000,
  });

  constructor() {
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) this.logger.warn('MP_ACCESS_TOKEN não definido no .env');

    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    this.api.defaults.headers.common['Content-Type'] = 'application/json';
    this.api.defaults.headers.common['X-Idempotency-Key'] = randomUUID();
  }
  async createPixCharge(
    input: CreatePixChargeInput,
  ): Promise<CreatePixChargeOutput> {
    const response = (
      await this.api.post('/v1/payments', {
        payment_method_id: 'pix',
        transaction_amount: input.amount,
        description: input.description ?? 'Cobrança PIX - Doação PixStream',
        external_reference: input.reference,
        notification_url: process.env.MP_PIX_NOTIFICATION_URL,
        payer: {
          entity_type: 'individual',
          email: 'doacao@pixstream.live',
        },
      })
    )?.data;

    if (!response?.id)
      throw new BadGatewayException('Erro ao criar cobrança no Mercado Pago');

    return {
      txid: String(response.id),
      qrCode: response.point_of_interaction?.transaction_data?.qr_code,
      raw: response,
    };
  }

  async parseWebhook(
    payload: any,
    headers: Record<string, any>,
  ): Promise<ParsedWebhook> {
    this.logger.debug(`Webhook recebido: ${JSON.stringify(payload)}`);

    const paymentId = payload.data?.id ?? payload.id;
    if (!paymentId)
      throw new BadGatewayException(
        'ID do pagamento não encontrado no webhook',
      );

    const response = (await this.api.get(`/v1/payments/${paymentId}`))?.data;

    if (!response?.id)
      throw new BadGatewayException('Erro ao buscar pagamento no Mercado Pago');

    const externalReference = response.external_reference;
    const amount = response.transaction_amount;
    let status: ParsedWebhook['status'];

    switch (response.status) {
      case 'approved':
        status = 'CONFIRMED';
        break;
      case 'pending':
      case 'in_process':
        status = 'PENDING';
        break;
      case 'rejected':
      case 'cancelled':
        status = 'FAILED';
        break;
      case 'refunded':
      case 'charged_back':
        status = 'REFUNDED';
        break;
      default:
        status = 'FAILED';
        break;
    }

    return {
      externalReference,
      status,
      amount,
      raw: response,
    };
  }
}
