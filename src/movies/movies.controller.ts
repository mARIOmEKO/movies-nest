import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
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
    @Get('movie/:id')
    async getMovieById(
        @Param('id', ParseIntPipe) id:number,
    ){
        return await this.moviesService.getMovieById(id);
    }

    @Get('/moviesWatched')
    async getMoviesWatchedByUser(@GetUser() user: User){
        return await this.moviesService.getMoviesWatchedByUser(user)
    }

    @Get('/moviesWishlisted')
    async getMoviesWishlistedByUser(@GetUser() user: User){
        return await this.moviesService.getMoviesWishlistedByUser(user)
    }

    @Post('watch/:id')
    async watchMovie(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id:number,
        ){
            // return {user, movieId}
        return await this.moviesService.watchMovie(user,id)
    }

    @Post('watchlist/:id')
    async addMovieToWatchlist(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id:number,
        ){
            // return {user, movieId}
        return await this.moviesService.addMovieToWatchlist(user,id)
    }

    
}
