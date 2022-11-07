import { ConflictException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { string } from 'joi';
import { NotFoundError } from 'rxjs';
import { LocalAuthenticationGuard } from 'src/auth/local-authentication.guard';
import { User } from 'src/user/users.entity';
import { Repository } from 'typeorm';
import { Movies } from './movies.entity';

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movies)
        private readonly moviesRepository: Repository<Movies>
    ){} 

    async getAllMovies(){
        return await this.moviesRepository.find()
    }
    async getMovieById(id: number){
        return await this.moviesRepository.findOne({where: {id}})
    }

    async getMoviesWatchedByUser(user: User){
        return await this.moviesRepository.findBy({userIdWatched: user.id.toString()})
    }

    async getMoviesWishlistedByUser(user:User){
        

        return await this.moviesRepository.findBy({userIdWishlisted: user.id.toString()})
    }

    async watchMovie(user:User, id:number){
        const movie = await this.moviesRepository.findOne({where: {id: id}})
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
        return movie;
    }

    async addMovieToWatchlist(user:User, id: number){
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
        return movie;
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
