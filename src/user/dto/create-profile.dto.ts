import { Role } from "@prisma/client";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProfileDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    firstName: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    subscribeExpire: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lastName: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    password: string

    @IsString()
    @IsOptional()
    imgUrl?: string
}
