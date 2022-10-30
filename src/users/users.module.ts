import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController]
})
export class UsersModule {}
