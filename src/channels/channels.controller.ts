import { Controller, Get, Param } from '@nestjs/common';

import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get(':slug')
  getPublicChannel(@Param('slug') slug: string) {
    return this.channelsService.findBySlug(slug);
  }
}
