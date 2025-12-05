import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChannelsModule } from '../channels/channels.module';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { AlertEvent } from './entities/alert-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlertEvent]), ChannelsModule],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
