import { Role } from "@prisma/client";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    firstName: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lastName: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    password: string

    @IsBoolean()
    emailConfirmed: boolean = false

    @IsString()
    @IsOptional()
    imgUrl?: string;

    @IsString()
    @IsOptional()
    key?: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role = Role.USER;
}
