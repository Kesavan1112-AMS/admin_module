import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WorkflowStepHistoryService } from './workflow-step-history.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number;
  };
}

@Controller('workflow-history') // Changed endpoint
@UseGuards(AuthGuard('jwt'))
export class WorkflowStepHistoryController {
  constructor(
    private readonly workflowStepHistoryService: WorkflowStepHistoryService,
  ) {}

  // Create, Update, Delete endpoints are removed as history should be immutable
  // and logging is handled internally by other services.

  @Get('instance/:instanceId')
  findAllForInstance(
    @Param('instanceId', ParseIntPipe) instanceId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { companyId } = req.user;
    return this.workflowStepHistoryService.findAllByInstanceId(instanceId, companyId);
  }
}
