import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { Role } from 'src/user/role.enum';
import { User } from 'src/user/users.entity';
import { DeleteResult, Like, Repository, SelectQueryBuilder } from 'typeorm';
import { AddMovieDto } from './dto/add-movie.dto';
import { GetMoviesFilterDto } from './dto/get-movies-filter.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movies, PaginatedMovie } from './movies.entity';
import { PagiantionResult, paginate, PaginateOptions } from './pagination/paginator';

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movies)
        private readonly moviesRepository: Repository<Movies>,

    ){} 

    async addMovie(addMovie: AddMovieDto){
        return await this.moviesRepository.save({...addMovie});
    }

    public getAllMoviesQuery(user:User){
        const query = this.moviesRepository.createQueryBuilder('m')
        .orderBy('m.id', 'DESC')
        // if(user.role == Role.User)
        // return query.select(normalUser)

        return query
    }

    public async getAllMoviesQueryFiltered(user: User,filter: GetMoviesFilterDto){
        const {search} = filter
        if(search){
            return await this.getAllMoviesQuery(user).andWhere('(m.title LIKE :search OR m.description LIKE :search)', {search: `%${search}%`})
        }
        else return await this.getAllMoviesQuery(user)
    }   

    public async getAllMovieQueryPaginatedFiltered(user: User,filter:GetMoviesFilterDto,paginateOptions: PaginateOptions): Promise<PaginatedMovie>{
        return await paginate(await this.getAllMoviesQueryFiltered(user,filter),paginateOptions)
    }

    
    
    async getMovieById(user: User,id: number): Promise<Movies>{
        const query= await this.getAllMoviesQuery(user)
        .where("m.id = :id", {id})
        if(user.role == Role.User)
        return query.select(normalUser).getOne()
        
        return query.getOne()
        // const movie = await this.moviesRepository.findOne({where: {id}})
        // if(!movie)
        //     throw new NotFoundException('Movie not found')

        // return movie;

    }

      async getMoviesWatchedByUser(user: User,filter:GetMoviesFilterDto) {
        // return await this.moviesRepository.findBy({userIdWatched: user.id.toString()})
        return (await this.getAllMoviesQueryFiltered(user, filter))
        .andWhere("m.userIdWatched @> ARRAY[:userId]", {userId: user.id.toString()})
        .select(normalUser)
    }

    async getMoviesWatchedByUserPaginated(user:User,filter:GetMoviesFilterDto,paginateOptions: PaginateOptions): Promise<PaginatedMovie>{
        return await paginate((await this.getMoviesWatchedByUser(user,filter)),paginateOptions)
    }

    async updateMovie(user:User,updateMovieDto: UpdateMovieDto, id: number) : Promise<Movies>{
        const updatedMovie = await this.moviesRepository.createQueryBuilder()
        .update(Movies)
        .set({...updateMovieDto})
        .where("id = :id",{id})
        .execute() 

        if(updatedMovie.affected === 0)
            throw new NotFoundException('Movie not found')
        return this.getMovieById(user,id)
        // const updatedMovie = await this.moviesRepository.update(id,{...updateMovieDto})
        // if (updatedMovie.affected === 0)
        //     throw new NotFoundException('Movie not found')
        // return this.getMovieById(user,id)
    }

      public async getMoviesWishlistedByUser(user:User,filter: GetMoviesFilterDto) {
        // return await this.moviesRepository.findBy({userIdWishlisted: user.id.toString()})
        
        return (await this.getAllMoviesQueryFiltered(user, filter))
        .where("m.userIdWishlisted @> ARRAY[:userId]", {userId: user.id.toString()})
        .select(normalUser)
      
    }

    async getMoviesWatchlistedByUserPagiated(user: User,filter: GetMoviesFilterDto, paginateOptions: PaginateOptions): Promise<PaginatedMovie>{
        try{return await paginate((await this.getMoviesWishlistedByUser(user,filter)),paginateOptions)}
        catch(err){
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: err
            }, HttpStatus.FORBIDDEN
            )
        }
    }

    async watchMovie(user:User, id:number) : Promise<Movies>{
        const movie = await this.moviesRepository.findOne({where: {id}})
        if(!movie)
            throw new NotFoundException('Movie not found')
   
        if(movie.userIdWatched.includes(user.id.toString()))
            throw new ConflictException('U have already watched this movie')

        if(movie.userIdWishlisted.includes(user.id.toString())){
            this.removeUserIdWatchlisted(movie.userIdWishlisted, user.id.toString())
            this.removeUser(movie.wishlistedBy, 'id' , user.id )
            console.log('movie removed from watchlist, added to watched')
        }
        movie.userIdWatched.push(user.id.toString())
        movie.watchedBy.push(user)
        await this.moviesRepository.save(movie)
        return this.getMovieById(user,id)
        // return this.moviesRepository.findOne({where: {id},select: ['id','description','title','rating']});
    }

    async addMovieToWatchlist(user:User, id: number): Promise<Movies>{
        const movie = await this.moviesRepository.findOne({where: {id: id}})
        if(!movie)
            throw new NotFoundException('Movie not found')
   
        if(movie.userIdWishlisted.includes(user.id.toString()))
            throw new ConflictException('This movie is already in your watchlist')
        
        if(movie.userIdWatched.includes(user.id.toString()))
            throw new ConflictException('U have already watched this movie')
        
        movie.userIdWishlisted.push(user.id.toString())
        movie.wishlistedBy.push(user)
        await this.moviesRepository.save(movie)
        return this.getMovieById(user,id)
        // return this.moviesRepository.findOne({where: {id},select: ['id','description','title','rating']});
    }

    public async deleteMovie(user: User,id: number) : Promise<DeleteResult>{
        // const movie= await this.getMovieById(user,id)
        // await this.moviesRepository.delete(movie.watchedBy)
        // await this.moviesRepository.delete(movie.wishlistedBy)
        // await this.moviesRepository.save(movie)
        
        return await this.moviesRepository
        .createQueryBuilder()
        .delete()
        .from(Movies)
        .where('id = :id',{id})
        .execute();
    }
    
      removeUser (arr, attr, value){
        var i = arr.length;
        while(i--){
           if( arr[i] 
               && arr[i].hasOwnProperty(attr) 
               && (arguments.length > 2 && arr[i][attr] === value ) ){ 
    
               arr.splice(i,1);
    
           }
        }
        return 'success';
    }

    removeUserIdWatchlisted(arr, value){
        for( var i = 0; i < arr.length; i++){ 
    
            if ( arr[i] === value) { 
        
                arr.splice(i, 1); 
            }}
    }

}
const normalUser= ["m.id","m.title", "m.description", "m.rating"]
