import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateWorkflowStepDto {
  @IsInt()
  companyId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  stepOrder: number;

  @IsOptional()
  @IsInt()
  requiredUserCategoryId?: number;

  @IsOptional()
  @IsInt()
  requiredPrivilegeId?: number;

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
