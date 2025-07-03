import { Controller, Post, Body } from '@nestjs/common';
import { WorkflowStepHistoryService } from './workflow-step-history.service';
import { CreateWorkflowStepHistoryDto } from './dto/create-workflow-step-history.dto';
import { UpdateWorkflowStepHistoryDto } from './dto/update-workflow-step-history.dto';

@Controller('workflow-step-history')
export class WorkflowStepHistoryController {
  constructor(
    private readonly workflowStepHistoryService: WorkflowStepHistoryService,
  ) {}

  @Post('create')
  create(@Body() body: CreateWorkflowStepHistoryDto) {
    return this.workflowStepHistoryService.create(body);
  }

  @Post('find-all')
  findAll(@Body() body: { companyId: number }) {
    return this.workflowStepHistoryService.findAll(Number(body.companyId));
  }

  @Post('find-one')
  findOne(@Body() body: { id: number }) {
    return this.workflowStepHistoryService.findOne(Number(body.id));
  }

  @Post('update')
  update(@Body() body: { id: number; data: UpdateWorkflowStepHistoryDto }) {
    return this.workflowStepHistoryService.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.workflowStepHistoryService.remove(Number(body.id));
  }
}
