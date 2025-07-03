import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';

// Company code should generally not be updatable after creation.
export class UpdateCompanyDto extends OmitType(PartialType(CreateCompanyDto), [
  'code',
] as const) {}
