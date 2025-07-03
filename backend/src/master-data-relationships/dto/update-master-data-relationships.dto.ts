import { PartialType } from '@nestjs/mapped-types';
import { CreateMasterDataRelationshipsDto } from './create-master-data-relationships.dto';

export class UpdateMasterDataRelationshipsDto extends PartialType(
  CreateMasterDataRelationshipsDto,
) {}
