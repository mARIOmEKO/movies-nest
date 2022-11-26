import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "src/user/role.enum";

export class CreateUserDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @ApiProperty()
    @IsEmail()
    readonly email:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly retypePassword: string;

    @IsEnum(Role)
    @IsOptional()
    readonly role: Role;
}