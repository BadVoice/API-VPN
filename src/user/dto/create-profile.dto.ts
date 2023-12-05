import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProfileDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    firstName: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lastName: string

    @IsString()
    @IsOptional()
    imgUrl?: string

    @IsString()
    @IsOptional()
    key?: string
}
