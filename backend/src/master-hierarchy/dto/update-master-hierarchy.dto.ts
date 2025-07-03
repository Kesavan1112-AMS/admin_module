import { PartialType } from '@nestjs/mapped-types';
import { CreateMasterHierarchyDto } from './create-master-hierarchy.dto';

export class UpdateMasterHierarchyDto extends PartialType(
  CreateMasterHierarchyDto,
) {}
