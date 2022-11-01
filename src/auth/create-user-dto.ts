import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "src/user/role.enum";

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsEmail()
    readonly email:string;

    @IsNotEmpty()
    @IsString()
    readonly retypePassword: string;

    @IsEnum(Role)
    @IsOptional()
    readonly role: Role;
}