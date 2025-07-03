import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  UseInterceptors, // Added
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WorkflowStepService } from './workflow-step.service';
import { ApplyBusinessRules } from '../core/decorators/apply-business-rules.decorator'; // Added
import { BusinessRuleInterceptor } from '../core/interceptors/business-rule.interceptor'; // Added
import { CreateWorkflowStepDto } from './dto/create-workflow-step.dto';
import { UpdateWorkflowStepDto } from './dto/update-workflow-step.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number;
  };
}

@Controller('workflow-steps') // Plural endpoint
@UseGuards(AuthGuard('jwt'))
export class WorkflowStepController {
  constructor(private readonly workflowStepService: WorkflowStepService) {}

  @Post()
  create(
    @Body() createDto: CreateWorkflowStepDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.workflowStepService.create(createDto, userId, companyId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const { companyId } = req.user;
    return this.workflowStepService.findAll(companyId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { companyId } = req.user;
    return this.workflowStepService.findOne(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateWorkflowStepDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.workflowStepService.update(id, updateDto, userId, companyId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.workflowStepService.remove(id, companyId, userId);
  }
}
