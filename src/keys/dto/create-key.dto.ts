import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateKeyDto {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsInt()
    @IsNotEmpty()
    port: number;

    @IsString()
    @IsNotEmpty()
    method: string;

    @IsString()
    accessUrl: string;
  }