import { Controller, Get } from '@nestjs/common';

@Controller('wallet')
export class WalletController {
  @Get('me')
  getMyWallet() {
    return {};
  }
}
