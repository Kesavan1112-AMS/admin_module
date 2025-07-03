import { Controller, Post, Body } from '@nestjs/common';
import { WorkflowStepService } from './workflow-step.service';
import { CreateWorkflowStepDto } from './dto/create-workflow-step.dto';
import { UpdateWorkflowStepDto } from './dto/update-workflow-step.dto';

@Controller('workflow-step')
export class WorkflowStepController {
  constructor(private readonly workflowStepService: WorkflowStepService) {}

  @Post('create')
  create(@Body() body: CreateWorkflowStepDto) {
    return this.workflowStepService.create(body);
  }

  @Post('find-all')
  findAll(@Body() body: { companyId: number }) {
    return this.workflowStepService.findAll(Number(body.companyId));
  }

  @Post('find-one')
  findOne(@Body() body: { id: number }) {
    return this.workflowStepService.findOne(Number(body.id));
  }

  @Post('update')
  update(@Body() body: { id: number; data: UpdateWorkflowStepDto }) {
    return this.workflowStepService.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.workflowStepService.remove(Number(body.id));
  }
}
