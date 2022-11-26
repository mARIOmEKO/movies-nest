import { PartialType } from "@nestjs/swagger";
import { AddMovieDto } from "./add-movie.dto";

export class UpdateMovieDto extends PartialType(AddMovieDto){
    
}