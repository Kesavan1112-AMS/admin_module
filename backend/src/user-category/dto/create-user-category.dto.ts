import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserCategoryDto {
  @IsInt()
  companyId: number;

  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  hierarchyLevel?: number;

  @IsOptional()
  @IsInt()
  masterTypeId?: number;

  @IsOptional()
  @IsString()
  accessScope?: string;

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
