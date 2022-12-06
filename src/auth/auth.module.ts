import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/users.entity';
import { RefreshTokenStrategy } from './refreshToken.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    ],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    ConfigModule.forRoot({isGlobal: true}),
    JwtModule.register({
      // secret: 'secret' ,
      secret: process.env.JWT_SECRET ,
      signOptions: {
      expiresIn: 3600,      
    }})],
  controllers: [AuthController]
})
export class AuthModule {}
