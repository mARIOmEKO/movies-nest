import { Body, ClassSerializerInterceptor, Controller, Post, Res, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/user/role.enum';
import { User } from 'src/user/users.entity';
import { CreateUserDto } from '../auth/create-user-dto';
import { LoginUserDto } from '../auth/login-user-dto';
import { AuthService } from './auth.service';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { JwtStrategy } from './jwt.strategy';
import { LocalAuthenticationGuard } from './local-authentication.guard';
import RoleGuard from './role.guard';
import { Response } from 'express';

@Controller('auth')
// @SerializeOptions({excludePrefixes: ['password']}) 
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<User>{
        console.log(createUserDto)
        return this.authService.register(createUserDto);
    }

    @Post('login')
    // @UseGuards(LocalAuthenticationGuard)
    // @UseGuards(AuthGuard())
    // @UseGuards(RoleGuard(Role.Admin))
    async login(@Body() loginUserDto: LoginUserDto ): Promise<{accessToken: string}>{
        return await this.authService.login(loginUserDto);
    }

  

}
