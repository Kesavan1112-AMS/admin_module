import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateWorkflowStepHistoryDto {
  @IsInt()
  workflowInstanceId: number;

  @IsInt()
  stepId: number;

  @IsString()
  actionTaken: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsInt()
  actionBy: number;
}
