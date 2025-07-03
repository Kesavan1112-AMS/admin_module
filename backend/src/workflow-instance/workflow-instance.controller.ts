import { Controller, Post, Body } from '@nestjs/common';
import { WorkflowInstanceService } from './workflow-instance.service';
import { CreateWorkflowInstanceDto } from './dto/create-workflow-instance.dto';
import { UpdateWorkflowInstanceDto } from './dto/update-workflow-instance.dto';

@Controller('workflow-instance')
export class WorkflowInstanceController {
  constructor(
    private readonly workflowInstanceService: WorkflowInstanceService,
  ) {}

  @Post('create')
  create(@Body() body: CreateWorkflowInstanceDto) {
    return this.workflowInstanceService.create(body);
  }

  @Post('find-all')
  findAll(@Body() body: { companyId: number }) {
    return this.workflowInstanceService.findAll(Number(body.companyId));
  }

  @Post('find-one')
  findOne(@Body() body: { id: number }) {
    return this.workflowInstanceService.findOne(Number(body.id));
  }

  @Post('update')
  update(@Body() body: { id: number; data: UpdateWorkflowInstanceDto }) {
    return this.workflowInstanceService.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.workflowInstanceService.remove(Number(body.id));
  }
}
