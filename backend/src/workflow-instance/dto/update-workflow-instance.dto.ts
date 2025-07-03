import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkflowInstanceDto } from './create-workflow-instance.dto';

export class UpdateWorkflowInstanceDto extends PartialType(
  CreateWorkflowInstanceDto,
) {}
