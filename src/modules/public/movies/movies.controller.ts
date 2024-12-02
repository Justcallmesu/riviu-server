import { JwtGuard } from '@/modules/common/guards/JWTGuards';
import { ParseJsonPipe } from '@/modules/common/pipes/parse-to-json';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import {
  CreateMoviesDto,
  MovieQuery,
  UpdateMoviesLikeCount,
} from './movies.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getMovies(@Query() query: MovieQuery) {
    return await this.moviesService.getMovies(query);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getMoviesByUserId(@Query() query: MovieQuery, @Req() req: Request) {
    return await this.moviesService.getMoviesByUserId(req, query);
  }

  @Get(':id')
  async getMovieById(@Param('id') id: number) {
    return await this.moviesService.getMovieById(id);
  }

  @Post(':id/like')
  async likeMovie(
    @Param('id') id: number,
    @Body() updateLike: UpdateMoviesLikeCount,
  ) {
    return await this.moviesService.likeMovie(id, updateLike);
  }

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createMovie(
    @Req() req: Request,
    @Body(
      'moviesData',
      new ParseJsonPipe(),
      new ValidationPipe({ expectedType: CreateMoviesDto }),
    )
    body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.moviesService.createMovie(req, body, file);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateMovie(
    @Req() req: Request,
    @Param('id') id: number,
    @Body(
      'moviesData',
      new ParseJsonPipe(),
      new ValidationPipe({ expectedType: CreateMoviesDto }),
    )
    body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.moviesService.updateMovie(id, req, body, file);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteMovie(@Param('id') id: number) {
    return await this.moviesService.deleteMovie(id);
  }
}
