import { IsOptional, IsString } from 'class-validator';

export class BaseQuery {
  @IsOptional()
  @IsString()
  limit = 10;

  @IsOptional()
  @IsString()
  page = 1;

  @IsOptional()
  @IsString()
  search: string;
}
