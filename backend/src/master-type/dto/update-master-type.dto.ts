import { PartialType } from '@nestjs/mapped-types';
import { CreateMasterTypeDto } from './create-master-type.dto';

export class UpdateMasterTypeDto extends PartialType(CreateMasterTypeDto) {}
