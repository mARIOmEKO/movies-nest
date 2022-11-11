import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import RoleGuard from 'src/auth/role.guard';
import { GetUser } from 'src/user/get-user-decorator';
import { Role } from 'src/user/role.enum';
import { User } from 'src/user/users.entity';
import { AddMovieDto } from './dto/add-movie.dto';
import { GetMoviesFilterDto } from './dto/get-movies-filter.dto';
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
    getAllMovies(
        @Query() filter: GetMoviesFilterDto,
        @GetUser() user: User
    ){
        return this.moviesService.getAllMovieQueryPaginatedFiltered(user,filter,{
        total: true,
        currentPage: filter.page,
        limit: 5})
    }
    @Get('movie/:id')
    async getMovieById(
        @Param('id', ParseIntPipe) id:number,
        @GetUser() user:User,
    ){
        return await this.moviesService.getMovieById(user,id);
    }

    @Get('watched')
    async getMoviesWatchedByUser(@GetUser() user: User){
        return await this.moviesService.getMoviesWatchedByUser(user)
    }

    @Get('wishlisted')
     getMoviesWishlistedByUser(@GetUser() user: User){
        return  this.moviesService.getMoviesWishlistedByUser(user)
    }

    @Patch(':id')
    @UseGuards(RoleGuard(Role.Admin))
    async updateMovie(
        @Param('id', ParseIntPipe) id:number,
        @Body() updateMovieDto: UpdateMovieDto,
        @GetUser() user: User,
    ){
        return await this.moviesService.updateMovie(user,updateMovieDto,id)
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
