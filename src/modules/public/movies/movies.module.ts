import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { MoviesController } from './movies.controller';
import { Movies } from './movies.entity';
import { MoviesService } from './movies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movies, User])],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
