import { BaseQuery } from '@/modules/common/model/query-model';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class BaseMoviesDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  synopsis: string;

  @IsNotEmpty()
  @IsString()
  releaseDate: string;

  @IsNotEmpty()
  @IsString()
  authorReview: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;
}

export class CreateMoviesDto extends BaseMoviesDto {}

export class UpdateMoviesDto extends BaseMoviesDto {}

export class UpdateMoviesLikeCount {
  @IsNotEmpty()
  @IsEnum(['like', 'dislike'])
  action: string;
}

export class MovieQuery extends BaseQuery {
  @IsOptional()
  @IsNumber()
  startRating: number;

  @IsOptional()
  @IsNumber()
  endRating: number;

  @IsOptional()
  @IsString()
  releaseDate: string;
}
