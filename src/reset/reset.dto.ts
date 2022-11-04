import { IsOptional, IsString } from "class-validator";

export class ResetDto{
    @IsOptional()
    @IsString()
    email?: string;
    @IsOptional()
    @IsString()
    token?: string;
}