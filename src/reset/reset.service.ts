import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/users.entity';
import { Repository } from 'typeorm';
import { ResetDto } from './reset.dto';
import { Reset } from './reset.entity';

@Injectable()
export class ResetService {
    constructor(
        @InjectRepository(Reset)
        private readonly resetRepository: Repository<Reset>,
        
    ){}

    async create(resetDto: ResetDto): Promise<Reset>{
        return await this.resetRepository.save(resetDto)
    }

    async findOne(token) : Promise<Reset>{
        return await this.resetRepository.findOne({where: {token:token}})
    }
}
