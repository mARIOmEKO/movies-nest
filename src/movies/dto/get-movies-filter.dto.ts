import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetMoviesFilterDto {
  @IsOptional()
  @ApiProperty()
  search: string;

  @ApiProperty()
  @IsOptional()
  page: number=1;
}