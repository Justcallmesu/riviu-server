import { Module } from '@nestjs/common';
import { AuthModule } from './public/auth/auth.module';
import { MoviesModule } from './public/movies/movies.module';

@Module({
  imports: [AuthModule, MoviesModule],
})
export class PublicModule {}
