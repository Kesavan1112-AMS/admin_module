import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyConfigurationDto } from './create-company-configuration.dto';

export class UpdateCompanyConfigurationDto extends PartialType(
  CreateCompanyConfigurationDto,
) {}
