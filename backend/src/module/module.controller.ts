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
import { ModuleService } from './module.service';
import { ApplyBusinessRules } from '../core/decorators/apply-business-rules.decorator'; // Added
import { BusinessRuleInterceptor } from '../core/interceptors/business-rule.interceptor'; // Added
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number;
  };
}

@Controller('modules') // Plural endpoint
@UseGuards(AuthGuard('jwt'))
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  create(
    @Body() createModuleDto: CreateModuleDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.moduleService.create(createModuleDto, userId, companyId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const { companyId } = req.user;
    return this.moduleService.findAll(companyId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { companyId } = req.user;
    return this.moduleService.findOne(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModuleDto: UpdateModuleDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.moduleService.update(id, updateModuleDto, userId, companyId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.moduleService.remove(id, companyId, userId);
  }
}
