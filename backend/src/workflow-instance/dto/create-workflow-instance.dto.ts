import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateWorkflowInstanceDto {
  @IsInt()
  companyId: number;

  @IsString()
  entityType: string;

  @IsInt()
  entityId: number;

  @IsOptional()
  @IsInt()
  currentStepId?: number;

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
