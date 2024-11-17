import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BaseQuery {
  @IsOptional()
  @IsNumber()
  limit = 10;

  @IsOptional()
  @IsNumber()
  page = 1;

  @IsOptional()
  @IsString()
  search: string;
}
