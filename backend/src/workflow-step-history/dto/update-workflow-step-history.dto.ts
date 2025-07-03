import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkflowStepHistoryDto } from './create-workflow-step-history.dto';

export class UpdateWorkflowStepHistoryDto extends PartialType(
  CreateWorkflowStepHistoryDto,
) {}
