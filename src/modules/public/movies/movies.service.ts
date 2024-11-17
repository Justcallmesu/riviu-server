import { ServerResponse } from '@/modules/common/model/response-model';
import { customPaginate } from '@/modules/common/utils/paginate';
import { FileService } from '@/modules/services/file.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import {
  CreateMoviesDto,
  MovieQuery,
  UpdateMoviesDto,
  UpdateMoviesLikeCount,
} from './movies.dto';
import { Movies } from './movies.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movies)
    private readonly moviesRepository: Repository<Movies>,
    private readonly fileService: FileService,
  ) {}

  async getMovies(query: MovieQuery) {
    const { endRating, limit, page, releaseDate, search, startRating } = query;

    const queryBuilder = this.moviesRepository.createQueryBuilder('movies');

    queryBuilder.leftJoinAndSelect('movies.author', 'author');

    if (startRating) {
      queryBuilder.andWhere('movies.rating >= :startRating', { startRating });
    }

    if (endRating) {
      queryBuilder.andWhere('movies.rating <= :endRating', { endRating });
    }

    if (releaseDate) {
      queryBuilder.andWhere('movies.releaseDate = :releaseDate', {
        releaseDate,
      });
    }

    if (search) {
      queryBuilder.andWhere('movies.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    return await customPaginate(queryBuilder, { limit, page });
  }

  async getMoviesByUserId(req: Request, query: MovieQuery) {
    const { endRating, limit, page, releaseDate, search, startRating } = query;

    const { id } = req.user as User;

    const queryBuilder = this.moviesRepository.createQueryBuilder('movies');

    queryBuilder.leftJoinAndSelect('movies.author', 'author');

    queryBuilder.where('movies.authorId = :id', { id });

    if (startRating) {
      queryBuilder.andWhere('movies.rating >= :startRating', { startRating });
    }

    if (endRating) {
      queryBuilder.andWhere('movies.rating <= :endRating', { endRating });
    }

    if (releaseDate) {
      queryBuilder.andWhere('movies.releaseDate = :releaseDate', {
        releaseDate,
      });
    }

    if (search) {
      queryBuilder.andWhere('movies.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    return await customPaginate(queryBuilder, { limit, page });
  }

  async getMovieById(id: number): Promise<ServerResponse<Movies>> {
    const foundMovies = await this.moviesRepository.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });

    if (!foundMovies) throw new NotFoundException('Film tidak ditemukan');
    return {
      data: foundMovies,
      message: 'Film berhasil ditemukan',
    };
  }

  async likeMovie(id: number, data: UpdateMoviesLikeCount) {
    const foundMovies = await this.moviesRepository.findOne({
      where: { id },
    });

    if (!foundMovies) throw new NotFoundException('Film tidak ditemukan');

    switch (data.action) {
      case 'like':
        foundMovies.likeCount++;
        break;
      case 'dislike':
        foundMovies.likeCount--;
        break;
    }

    await this.moviesRepository.save(foundMovies);

    return {
      message: 'Berhasil mengubah like count',
    };
  }

  async createMovie(
    req: Request,
    data: CreateMoviesDto,
    file: Express.Multer.File,
  ): Promise<ServerResponse<Movies>> {
    const newMovies = this.moviesRepository.create(data);

    if (newMovies.rating < 0 || newMovies.rating > 5) {
      throw new BadRequestException('Rating harus antara 0 - 5');
    }

    if (!file) throw new BadRequestException('Tolong upload gambar film');

    newMovies.authorId = (req.user as User).id;

    const savedFile = await this.fileService.saveFile(newMovies, file);
    newMovies.image = savedFile;

    await this.moviesRepository.save(newMovies);

    return {
      data: newMovies,
      message: 'Film berhasil dibuat',
    };
  }

  async updateMovie(
    id: number,
    req: Request,
    data: UpdateMoviesDto,
    file: Express.Multer.File,
  ) {
    const foundMovies = await this.moviesRepository.findOne({
      where: { id },
    });

    if (!foundMovies) throw new NotFoundException('Film tidak ditemukan');

    const user = req.user as User;

    if (foundMovies.authorId !== user.id) {
      throw new UnauthorizedException('Anda tidak memiliki akses ke film ini');
    }

    const updatedMovies = this.moviesRepository.create({
      ...foundMovies,
      ...data,
    });

    if (file) {
      await this.fileService.deleteFile(foundMovies.image);
      const savedFile = await this.fileService.saveFile(updatedMovies, file);
      updatedMovies.image = savedFile;
    }

    await this.moviesRepository.save(updatedMovies);

    return {
      data: updatedMovies,
      message: 'Film berhasil diubah',
    };
  }

  async deleteMovie(id: number) {
    const foundMovies = await this.moviesRepository.findOne({
      where: { id },
    });

    if (!foundMovies) throw new NotFoundException('Film tidak ditemukan');

    await this.fileService.deleteFile(foundMovies.image);

    await this.moviesRepository.delete({ id });

    return {
      message: 'Film berhasil dihapus',
    };
  }
}
