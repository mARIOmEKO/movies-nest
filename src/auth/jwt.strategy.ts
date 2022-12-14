import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from "typeorm";
import { JwtPayload } from "./jwt-payload-interface";
import { User } from "../user/users.entity";
import * as config from 'config';
import { Role } from "src/user/role.enum";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true, //set to true in production
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
            // secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(payload: JwtPayload) : Promise<User>{
        const user = await this.userRepository.findOne({where : {username: payload.username}});
        if(!user)
            throw new UnauthorizedException();
        
        return user;
    }
}