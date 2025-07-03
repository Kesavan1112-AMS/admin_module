import { PartialType } from '@nestjs/mapped-types';
import { CreatePrivilegeMasterDto } from './create-privilege-master.dto';

export class UpdatePrivilegeMasterDto extends PartialType(
  CreatePrivilegeMasterDto,
) {}
