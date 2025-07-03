import { PartialType } from '@nestjs/mapped-types';
import { CreateUserMasterMappingDto } from './create-user-master-mapping.dto';

export class UpdateUserMasterMappingDto extends PartialType(
  CreateUserMasterMappingDto,
) {}
