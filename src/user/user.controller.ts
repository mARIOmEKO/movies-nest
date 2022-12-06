import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import RoleGuard from 'src/auth/role.guard';
import { DeleteResult } from 'typeorm';
import { Role } from './role.enum';
import { UserService } from './user.service';
import { User } from './users.entity';


@UseGuards(RoleGuard(Role.Admin))
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ){}

    @Get()
    getAllUsers():Promise<User[] | undefined>{
        return this.userService.getAllUsers()
    }

    @Get(':id')
    getUserById(
        @Param('id', ParseIntPipe) id:number
    ): Promise<User | undefined>{
        return this.userService.getUserById(id)
    }

    @Delete(':id')
    deleteAccount(
        @Param('id', ParseIntPipe) id:number
    ):Promise<DeleteResult>{
        return this.userService.deleteAccount(id)
    }
}
