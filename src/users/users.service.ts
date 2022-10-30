import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { AppService } from 'src/app.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user-dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async register(createUserDto: CreateUserDto) : Promise<User>{
        if (createUserDto.password != createUserDto.retypePassword){
            throw new HttpException ('password does not match',HttpStatus.CONFLICT)
        }
        const user = this.userRepository.create(createUserDto)
        
        return this.userRepository.save(user);
    }
    
}
