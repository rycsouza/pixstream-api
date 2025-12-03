import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/payments/entities/payment.entity';
import { Repository } from 'typeorm';

import { WalletAccount } from './entities/wallet-account.entity';
import {
  WalletTransaction,
  WalletTransactionSourceType,
  WalletTransactionType,
} from './entities/wallet-transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletAccount)
    private readonly walletAccountRepository: Repository<WalletAccount>,
    @InjectRepository(WalletTransaction)
    private readonly walletTransactionRepository: Repository<WalletTransaction>,
  ) {}

  async createDefaultWalletForUser(userId: string): Promise<WalletAccount> {
    const walletExists = await this.walletAccountRepository.findOne({
      where: { userId },
    });
    if (walletExists) return walletExists;

    const wallet = this.walletAccountRepository.create({
      userId,
      balance: '0.00',
      currency: 'BRL',
    });

    return this.walletAccountRepository.save(wallet);
  }

  async creditFromPayment(payment: Payment): Promise<{
    wallet: WalletAccount;
    walletTransaction: WalletTransaction;
  }> {
    const wallet = await this.walletAccountRepository.findOne({
      where: { userId: payment.userId },
    });
    if (!wallet)
      throw new BadRequestException('Carteira não encontrada para o usuário.');

    const balanceBefore = Number(wallet.balance);
    const balanceAfter = balanceBefore + Number(payment.netAmount);

    const walletTransaction = this.walletTransactionRepository.create({
      walletAccountId: wallet.id,
      type: WalletTransactionType.CREDIT,
      sourceType: WalletTransactionSourceType.PAYMENT,
      sourceId: payment.id,
      amount: payment.netAmount,
      balanceBefore: balanceBefore.toFixed(2),
      balanceAfter: balanceAfter.toFixed(2),
      description: `Crédito de pagamento #${payment.id}`,
    });

    wallet.balance = balanceAfter.toFixed(2);

    await this.walletTransactionRepository.save(walletTransaction);
    await this.walletAccountRepository.save(wallet);

    return { wallet, walletTransaction };
  }
}
