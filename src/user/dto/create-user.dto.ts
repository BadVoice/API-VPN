import { Role } from "@prisma/client";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsBoolean()
    emailConfirmed: boolean = false

    @IsEnum(Role)
    @IsOptional()
    role?: Role = Role.USER;
}
