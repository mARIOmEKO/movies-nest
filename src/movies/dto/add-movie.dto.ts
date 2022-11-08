import { IsNotEmpty } from "class-validator";

export class AddMovieDto{
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    rating: string;
}