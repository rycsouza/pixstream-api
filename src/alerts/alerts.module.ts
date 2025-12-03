import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsGateway } from './alerts.gateway';
import { AlertsService } from './alerts.service';
import { Module } from '@nestjs/common';
import { AlertEvent } from './entities/alert-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlertEvent])],
  providers: [AlertsService, AlertsGateway],
  exports: [AlertsService],
})
export class AlertsModule {}
