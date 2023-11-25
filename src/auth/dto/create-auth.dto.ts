import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator"

export class SignInDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    password: string
}
