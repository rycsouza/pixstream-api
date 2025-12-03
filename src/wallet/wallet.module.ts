import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletAccount } from './entities/wallet-account.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { WithdrawRequest } from './entities/withdraw-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WalletAccount,
      WalletTransaction,
      WithdrawRequest,
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
