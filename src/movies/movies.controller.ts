import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/get-user-decorator';
import { User } from 'src/user/users.entity';
import { MoviesService } from './movies.service';

@Controller('movies')
@UseGuards(AuthGuard())
export class MoviesController {
    constructor(
        private readonly moviesService: MoviesService
    ){}
    
    @Get()
    async getAllMovies(){
        return this.moviesService.getAllMovies()
    }

    @Get('/all')
    async getMoviesWatchedByUser(@GetUser() user: User){
        return await this.moviesService.getMoviesWatchedByUser(user)
    }

    @Get('/moviesWishlisted')
    async getMoviesWishlistedByUser(@GetUser() user: User){
        return await this.moviesService.getMoviesWishlistedByUser(user)
    }

    @Post()
    async watchMovie(
        @GetUser() user: User,
        @Body('movieId') movieId: number){
            // return {user, movieId}
        return await this.moviesService.watchMovie(user,movieId)
    }
    
}
