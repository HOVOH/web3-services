import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from './assets/assets.module';
import { EvmModule } from './evm/evm.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OlympusproModule } from './olympuspro/olympuspro.module';
import { MigrationService } from './migration.service';
import { migrations } from '../migrations';
import { AmmModule } from './amm/amm.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        logging: false,
        migrations: migrations,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AssetsModule,
    EvmModule,
    AmmModule,
    OlympusproModule,
  ],
  controllers: [AppController],
  providers: [AppService, MigrationService],
})
export class AppModule {}
