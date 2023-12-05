import { IsObject, IsString } from 'class-validator';

class AmountDto {
  @IsString()
  value: string;

  @IsString()
  currency: string;
}

class PaymentMethodDataDto {
  @IsString()
  type: string;
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

  @IsObject()
  payment_method_data: PaymentMethodDataDto;

  @IsObject()
  confirmation: ConfirmationDto;

  @IsString()
  description: string;
}
