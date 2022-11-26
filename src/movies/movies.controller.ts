import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import RoleGuard from 'src/auth/role.guard';
import { GetUser } from 'src/user/get-user-decorator';
import { Role } from 'src/user/role.enum';
import { User } from 'src/user/users.entity';
import { DeleteResult } from 'typeorm';
import { AddMovieDto } from './dto/add-movie.dto';
import { GetMoviesFilterDto } from './dto/get-movies-filter.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movies, PaginatedMovie } from './movies.entity';
import { MoviesService } from './movies.service';

@ApiTags('MOVIES')
@Controller('movies')
@UseGuards(AuthGuard())
export class MoviesController {
    constructor(
        private readonly moviesService: MoviesService
    ){}
    
    @Post()
    @UseGuards(RoleGuard(Role.Admin))
    async addMovie(@Body() addMovie:AddMovieDto) :Promise<Movies>{
        return this.moviesService.addMovie(addMovie);
    }


    @Get()
    getAllMovies(
        @Query() filter: GetMoviesFilterDto,
        @GetUser() user: User
        ):Promise<PaginatedMovie>{
            return this.moviesService.getAllMovieQueryPaginatedFiltered(user,filter,{
                total: true,
                currentPage: filter.page,
                limit: 5})
            }
        
    @Get('watched')
    async getMoviesWatchedByUser(@GetUser() user: User,
    @Query() filter:GetMoviesFilterDto) :Promise<PaginatedMovie>{
        return await this.moviesService.getMoviesWatchedByUserPaginated(user,filter,{
            total:true,
            currentPage: filter.page,
            limit: 5
        })
    }
    
    @Get('movie/:id')
    async getMovieById(
        @Param('id', ParseIntPipe) id:number,
        @GetUser() user:User,
    ):Promise<Movies>{
        return await this.moviesService.getMovieById(user,id);
    }


    @Get('wishlisted')
     getMoviesWishlistedByUser(@GetUser() user: User,
     @Query() filter:GetMoviesFilterDto):Promise<PaginatedMovie>{
        return  this.moviesService.getMoviesWatchlistedByUserPagiated(user,filter,{
            total:true,
            currentPage: filter.page,
            limit: 5
        })
    }

    @Patch(':id')
    @UseGuards(RoleGuard(Role.Admin))
    async updateMovie(
        @Param('id', ParseIntPipe) id:number,
        @Body() updateMovieDto: UpdateMovieDto,
        @GetUser() user: User,
    ):Promise<Movies>{
        return await this.moviesService.updateMovie(user,updateMovieDto,id)
    }

    @Post('watch/:id')
    async watchMovie(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id:number,
        ):Promise<Movies>{
        return await this.moviesService.watchMovie(user,id)
    }

    @Post('watchlist/:id')
    async addMovieToWatchlist(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id:number,
        ):Promise<Movies>{
        return await this.moviesService.addMovieToWatchlist(user,id)
    }

    @Delete(':id')
    @UseGuards(RoleGuard(Role.Admin))
    async deleteMovie(
        @GetUser() user:User,
        @Param('id', ParseIntPipe) id:number,
    ):Promise<DeleteResult>{
        return await this.moviesService.deleteMovie(user,id)
    }
    
}
