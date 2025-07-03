import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCompanyConfigurationDto {
  @IsInt()
  companyId: number;

  @IsString()
  configKey: string;

  @IsOptional()
  configValue?: any;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  createdBy?: number;

  @IsOptional()
  @IsInt()
  updatedBy?: number;
}
