import { AdminService } from './admin.service';
import { Module } from '@nestjs/common';

import { AdminController } from './admin.controller';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
