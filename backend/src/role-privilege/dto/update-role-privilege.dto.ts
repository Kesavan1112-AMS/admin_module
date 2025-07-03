import { PartialType } from '@nestjs/mapped-types';
import { CreateRolePrivilegeDto } from './create-role-privilege.dto';

export class UpdateRolePrivilegeDto extends PartialType(
  CreateRolePrivilegeDto,
) {}
