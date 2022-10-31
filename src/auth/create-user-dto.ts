import { IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "src/user/role.enum";

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsNotEmpty()
    @IsString()
    readonly retypePassword: string;

    @IsEnum(Role)
    readonly role: Role;
}