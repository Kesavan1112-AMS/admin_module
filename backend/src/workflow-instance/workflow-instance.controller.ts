import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, // Will be used for a specific 'cancel' operation
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
  UseInterceptors, // Added
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WorkflowInstanceService } from './workflow-instance.service';
import { ApplyBusinessRules } from '../core/decorators/apply-business-rules.decorator'; // Added
import { BusinessRuleInterceptor } from '../core/interceptors/business-rule.interceptor'; // Added
import { CreateWorkflowInstanceDto } from './dto/create-workflow-instance.dto';
import { UpdateWorkflowInstanceDto } from './dto/update-workflow-instance.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number;
  };
}

@Controller('workflow-instances') // Plural endpoint
@UseGuards(AuthGuard('jwt'))
export class WorkflowInstanceController {
  constructor(
    private readonly workflowInstanceService: WorkflowInstanceService,
  ) {}

  @Post()
  create(
    @Body() createDto: CreateWorkflowInstanceDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.workflowInstanceService.create(createDto, userId, companyId);
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('entityType') entityType?: string,
    @Query('entityId', new ParseIntPipe({ optional: true })) entityId?: number,
    @Query('status') status?: string,
    @Query('currentStepId', new ParseIntPipe({ optional: true })) currentStepId?: number,
  ) {
    const { companyId } = req.user;
    return this.workflowInstanceService.findAll(companyId, entityType, entityId, status, currentStepId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { companyId } = req.user;
    return this.workflowInstanceService.findOne(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateWorkflowInstanceDto,
    @Req() req: AuthenticatedRequest,
  ) {
    // This is a general update, usually for status/step changes by the system or specific workflow actions
    const { id: userId, companyId } = req.user;
    return this.workflowInstanceService.update(id, updateDto, userId, companyId);
  }

  @Delete(':id/cancel') // Specific action for cancelling
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.workflowInstanceService.cancel(id, companyId, userId);
  }
}
