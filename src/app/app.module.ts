import { databaseConfig } from '@/config/database/orm.config';
import { PublicModule } from '@/modules/public-module';
import { FilesModule } from '@/modules/services/files.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => databaseConfig(configService),
    }),
    PublicModule,
    FilesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
