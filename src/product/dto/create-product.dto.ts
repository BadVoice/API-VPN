import { IsString, IsUUID } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string

    @IsString()
    region: string

    @IsString()
    @IsUUID()
    userId: string
}
