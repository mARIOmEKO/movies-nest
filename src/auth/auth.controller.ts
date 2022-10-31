import { Body, ClassSerializerInterceptor, Controller, Post, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { User } from 'src/user/users.entity';
import { CreateUserDto } from '../auth/create-user-dto';
import { LoginUserDto } from '../auth/login-user-dto';
import { AuthService } from './auth.service';

@Controller('auth')
// @SerializeOptions({excludePrefixes: ['password']}) 
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<User>{
        return this.authService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto ): Promise<{accessToken: string}>{
        return await this.authService.login(loginUserDto);
    }

}
