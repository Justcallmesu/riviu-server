import { GlobalEntity } from '@/global.entity';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: configService.get<string>('DB_TYPE') as any,
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: await configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: GlobalEntity,
    synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'TRUE',
    namingStrategy: new SnakeNamingStrategy(),
    bigNumberStrings: false,
    extra: {
      decimalNumbers: true,
    },
  };
};
