import { ConflictException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

        movie.userIdWatched.push(user.id.toString())
        movie.watchedBy.push(user)
        await this.moviesRepository.save(movie)
        return movie;
    }

}
