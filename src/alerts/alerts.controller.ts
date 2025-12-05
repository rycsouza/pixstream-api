import { Controller, Query, UnauthorizedException } from '@nestjs/common';
import { Sse } from '@nestjs/common';
import { Observable } from 'rxjs';

import { ChannelsService } from '../channels/channels.service';
import { AlertsService, SseMessageEvent } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(
    private readonly alertsService: AlertsService,
    private readonly channelsService: ChannelsService,
  ) {}

  @Sse('stream')
  async stream(
    @Query('widgetToken') widgetToken: string,
  ): Promise<Observable<SseMessageEvent>> {
    if (!widgetToken) {
      throw new UnauthorizedException('widgetToken é obrigatório');
    }

    const channel = await this.channelsService.findByWidgetToken(widgetToken);
    if (!channel) {
      throw new UnauthorizedException('widgetToken inválido');
    }

    // Aqui você poderia, se quiser, registrar algo de presença/log
    return this.alertsService.subscribeToChannel(channel.id);
  }
}
