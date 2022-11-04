import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../auth/create-user-dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../auth/jwt-payload-interface';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../auth/login-user-dto';
import { User } from 'src/user/users.entity';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ){}

    async register(createUserDto: CreateUserDto) : Promise<User>{
        const salt = await bcrypt.genSalt();
        if (createUserDto.password != createUserDto.retypePassword){
            throw new HttpException ('password does not match',HttpStatus.CONFLICT)
        }

        const user = new User();
        if(createUserDto.role){
            user.role= createUserDto.role
        }
        user.username = createUserDto.username;
        user.salt = salt;
        user.email = createUserDto.email;
        user.password = await this.hashPassword(createUserDto.password, salt);
        try{
           return await this.userRepository.save(user);
            } catch (error){
                if(error.code == 23505){ //duplicate username or email
                    // console.log(error)
                    throw new ConflictException(error.detail)  //print the duplicate error for the certain field
                    }
                throw new InternalServerErrorException();
                }
    }

    async login (loginUserDto: LoginUserDto): Promise<{accessToken:string}>{
        const username= await this.validatePassword(loginUserDto);
        // const role = {loginUserDto}
        if (!username)
        throw new NotFoundException('Credentials does not match sorry bro');

        const payload : JwtPayload= {username};
        const accessToken = await this.jwtService.sign(payload);
        return {accessToken}
    }

    private async hashPassword(password: string, salt: string) : Promise<string>{
        return bcrypt.hash(password,salt)
    }

    async validatePassword(loginUserDto: LoginUserDto) :Promise<string>{
        const {username, password} = loginUserDto;
        const user = await this.userRepository.findOne({where: {username}});
        if(user && await user.validateUserPassword(password))
        return user.username

        return null;

    }

    async update( id: number, data){
        return await this.userRepository.update(id,data)
    }
}
