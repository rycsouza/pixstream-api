import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminModule } from './admin/admin.module';
import { AlertsModule } from './alerts/alerts.module';
import { AuthModule } from './auth/auth.module';
import { ChannelsModule } from './channels/channels.module';
import { CommonModule } from './common/common.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        synchronize: config.get<string>('NODE_ENV', 'production') === 'development',
        logging: config.get<string>('DB_LOGGING', 'false') === 'true',
      }),
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    ChannelsModule,
    PaymentsModule,
    WalletModule,
    AlertsModule,
    AdminModule,
  ],
})
export class AppModule {}
