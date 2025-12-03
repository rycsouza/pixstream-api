import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

interface CreatePixChargeInput {
  amount: number;
  reference: string;
  expirationInMinutes?: number;
}

interface CreatePixChargeOutput {
  txid: string;
  qrcode: string;
}

export class PaymentGatewayService {
  async createPixCharge(
    input: CreatePixChargeInput,
  ): Promise<CreatePixChargeOutput> {
    const txid = crypto.randomUUID();
    const qrcode = `pix://payment?txid=${txid}&amount=${input.amount}&reference=${input.reference}`;

    return {
      txid,
      qrcode,
    };
  }
}
