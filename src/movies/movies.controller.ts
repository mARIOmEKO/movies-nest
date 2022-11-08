import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import RoleGuard from 'src/auth/role.guard';
import { GetUser } from 'src/user/get-user-decorator';
import { Role } from 'src/user/role.enum';
import { User } from 'src/user/users.entity';
import { AddMovieDto } from './dto/add-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
@UseGuards(AuthGuard())
export class MoviesController {
    constructor(
        private readonly moviesService: MoviesService
    ){}
    
    @Post()
    @UseGuards(RoleGuard(Role.Admin))
    async addMovie(@Body() addMovie:AddMovieDto){
        return this.moviesService.addMovie(addMovie);
    }


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

    @Patch(':id')
    @UseGuards(RoleGuard(Role.Admin))
    async updateMovie(
        @Param('id', ParseIntPipe) id:number,
        @Body() updateMovieDto: UpdateMovieDto,
    ){
        return await this.moviesService.updateMovie(updateMovieDto,id)
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
