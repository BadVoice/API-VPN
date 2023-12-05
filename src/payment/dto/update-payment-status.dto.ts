import { IsString, IsIn } from 'class-validator';

export class UpdatePaymentStatusDto {
  @IsString()
  @IsIn(['pending', 'paid', 'failed'])
  status: string;
}