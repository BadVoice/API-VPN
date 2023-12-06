import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

class AmountDto {
  @IsString()
  value: string;

  @IsString()
  currency: string;
}

class MetadataDto {
  @IsString()
  productName: string

  @IsString()
  productRegion: string

  @IsUUID()
  userId: string;
}
class ConfirmationDto {
  @IsString()
  type: string;

  @IsString()
  return_url: string;
}

export class CreatePaymentDto {

  @IsObject()
  amount: AmountDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;

  @IsObject()
  confirmation: ConfirmationDto;

  @IsString()
  description: string;
}
