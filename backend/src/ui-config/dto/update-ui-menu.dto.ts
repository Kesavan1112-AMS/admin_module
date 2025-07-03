import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUiMenuDto } from './create-ui-menu.dto';

export class UpdateUiMenuDto extends OmitType(PartialType(CreateUiMenuDto), [
  'companyId', // companyId should not be changed
  'createdBy'
] as const) {}
