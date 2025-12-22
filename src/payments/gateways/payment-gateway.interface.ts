export interface CreatePixChargeInput {
  amount: number;
  currency: string;
  reference: string;
  description?: string;
}

export interface CreatePixChargeOutput {
  txid: string;
  qrCode: string;
  raw?: any;
}

export interface ParsedWebhook {
  externalReference: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  amount: number;
  raw: any;
}

export interface IPaymentGateway {
  createPixCharge(input: CreatePixChargeInput): Promise<CreatePixChargeOutput>;
  parseWebhook(
    payload: any,
    headers: Record<string, any>,
  ): Promise<ParsedWebhook>;
}
