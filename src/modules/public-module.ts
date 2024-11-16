import { Module } from '@nestjs/common';
import { AuthModule } from './public/auth/auth.module';

@Module({
  imports: [AuthModule],
})
export class PublicModule {}
