import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetMoviesFilterDto {
  @IsOptional()
  search: string;

  @IsOptional()
  page: number=1;
}