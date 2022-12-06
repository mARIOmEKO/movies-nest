import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './users.entity';

@Module({
  controllers: [UserController],
  providers: [UserService,JwtStrategy],
  imports: [TypeOrmModule.forFeature([User]),
  PassportModule.register({defaultStrategy: 'jwt'}),
  ConfigModule.forRoot({isGlobal: true
  }),
  JwtModule.register({
    secret: process.env.JWT_SECRET ,
    signOptions: {
    expiresIn: 3600,   }})
]
})
export class UserModule {}
