import { PartialType } from '@nestjs/mapped-types';
import { CreateKeyDto } from './create-key.dto';

export class UpdateKeyDto extends PartialType(CreateKeyDto) {}
