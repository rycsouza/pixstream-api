import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async findBySlug(slug: string) {
    return this.channelRepository.findOne({ where: { slug, isActive: true } });
  }

  private buildSlugFromUser(user: User): string {
    const base =
      user.name?.trim() ?? user.email.split('@')[0] ?? `user-${user.id}`;

    return base
      .normalize('NFC')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async createDefaultChannelForUser(user: User) {
    const existingChannel = await this.channelRepository.findOne({
      where: { userId: user.id },
    });
    if (existingChannel) return existingChannel;

    const slug = this.buildSlugFromUser(user);
    const channel = this.channelRepository.create({
      userId: user.id,
      name: user.name ?? 'Meu Canal',
      slug,
      description: `Canal gerado automaticamente para o usuário ${user.name}`,
      widgetToken: crypto.randomUUID(),
      isActive: true,
      minAlertAmount: '0.00',
      showDonorName: true,
    });

    return this.channelRepository.save(channel);
  }

  async findByWidgetToken(widgetToken: string) {
    return this.channelRepository.findOne({
      where: { widgetToken, isActive: true },
    });
  }
}
