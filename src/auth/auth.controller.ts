import { Body, ClassSerializerInterceptor, Controller, Get, Post, Req, Res, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/user/role.enum';
import { User } from 'src/user/users.entity';
import { CreateUserDto } from '../auth/create-user-dto';
import { LoginUserDto } from '../auth/login-user-dto';
import { AuthService } from './auth.service';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { JwtStrategy } from './jwt.strategy';
import RoleGuard from './role.guard';
import { Request } from 'express';
import { RefreshTokenStrategy } from './refreshToken.strategy';
import { RefreshTokenGuard } from './refreshToken.guard';
import { GetUser } from 'src/user/get-user-decorator';
import { ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('MOVIES')
// @SerializeOptions({excludePrefixes: ['password']}) 
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}

    
    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@Req() req: Request) {
        const userId = req.user['sub'];
  const refreshToken = req.user['refreshToken'];

        return this.authService.refreshTokens(+userId, refreshToken);
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto){
        console.log(createUserDto)
        return this.authService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto ): Promise<{accessToken: string}>{
        return await this.authService.login(loginUserDto);
    }

  

}
