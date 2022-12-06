import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async getAllUsers() : Promise<User[] | undefined>{
        return await this.userRepository.find()
    }

    async getUserById(id: number) : Promise<User | undefined>{
        return await this.userRepository.findOne({where: {id}})
    }

    async deleteAccount(id: number) : Promise<DeleteResult>{
        return await this.userRepository
        .createQueryBuilder('u')
        .delete()
        .where('id = :id', {id})
        .execute()
    }

}
