import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './create-user-dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ){}

    @Post()
    async register(@Body() createUserDto: CreateUserDto){
        return this.usersService.register(createUserDto);
    }
}
