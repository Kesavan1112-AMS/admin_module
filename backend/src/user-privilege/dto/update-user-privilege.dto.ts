import { PartialType } from '@nestjs/mapped-types';
import { CreateUserPrivilegeDto } from './create-user-privilege.dto';

export class UpdateUserPrivilegeDto extends PartialType(
  CreateUserPrivilegeDto,
) {}
