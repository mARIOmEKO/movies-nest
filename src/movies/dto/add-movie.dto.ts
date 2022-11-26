import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AddMovieDto{
    @ApiProperty()
    @IsNotEmpty()
    title: string;
    @ApiProperty()
    @IsNotEmpty()
    description: string;
    @ApiProperty()
    @IsNotEmpty()
    rating: string;
}