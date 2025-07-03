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
import { RolePrivilegeService } from './role-privilege.service';
import { ApplyBusinessRules } from '../core/decorators/apply-business-rules.decorator'; // Added
import { BusinessRuleInterceptor } from '../core/interceptors/business-rule.interceptor'; // Added
import { CreateRolePrivilegeDto } from './dto/create-role-privilege.dto';
import { UpdateRolePrivilegeDto } from './dto/update-role-privilege.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number;
  };
}

@Controller('role-privileges') // Plural endpoint
@UseGuards(AuthGuard('jwt'))
export class RolePrivilegeController {
  constructor(private readonly rolePrivilegeService: RolePrivilegeService) {}

  @Post()
  create(
    @Body() createDto: CreateRolePrivilegeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId } = req.user;
    return this.rolePrivilegeService.create(createDto, actingUserId, companyId);
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('userCategoryId', new ParseIntPipe({ optional: true })) userCategoryId?: number,
    @Query('privilegeId', new ParseIntPipe({ optional: true })) privilegeId?: number,
  ) {
    const { companyId } = req.user;
    return this.rolePrivilegeService.findAll(companyId, userCategoryId, privilegeId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { companyId } = req.user;
    return this.rolePrivilegeService.findOne(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRolePrivilegeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId } = req.user;
    return this.rolePrivilegeService.update(id, updateDto, actingUserId, companyId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId } = req.user;
    return this.rolePrivilegeService.remove(id, companyId, actingUserId);
  }
}
