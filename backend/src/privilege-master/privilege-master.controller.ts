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
  Query,
  ParseIntPipe,
  UseInterceptors, // Added
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrivilegeMasterService } from './privilege-master.service';
import { ApplyBusinessRules } from '../core/decorators/apply-business-rules.decorator'; // Added
import { BusinessRuleInterceptor } from '../core/interceptors/business-rule.interceptor'; // Added
import { CreatePrivilegeMasterDto } from './dto/create-privilege-master.dto';
import { UpdatePrivilegeMasterDto } from './dto/update-privilege-master.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number;
  };
}

@Controller('privileges') // Changed to 'privileges'
@UseGuards(AuthGuard('jwt'))
export class PrivilegeMasterController {
  constructor(
    private readonly privilegeMasterService: PrivilegeMasterService,
  ) {}

  @Post()
  create(
    @Body() createPrivilegeDto: CreatePrivilegeMasterDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.privilegeMasterService.create(createPrivilegeDto, userId, companyId);
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('moduleId', new ParseIntPipe({ optional: true })) moduleId?: number,
  ) {
    const { companyId } = req.user;
    return this.privilegeMasterService.findAll(companyId, moduleId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { companyId } = req.user;
    return this.privilegeMasterService.findOne(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePrivilegeDto: UpdatePrivilegeMasterDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.privilegeMasterService.update(id, updatePrivilegeDto, userId, companyId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.privilegeMasterService.remove(id, companyId, userId);
  }
}
