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
import { UserPrivilegeService } from './user-privilege.service';
import { ApplyBusinessRules } from '../core/decorators/apply-business-rules.decorator'; // Added
import { BusinessRuleInterceptor } from '../core/interceptors/business-rule.interceptor'; // Added
import { CreateUserPrivilegeDto } from './dto/create-user-privilege.dto';
import { UpdateUserPrivilegeDto } from './dto/update-user-privilege.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number; // This is the acting user
    companyId: number;
  };
}

@Controller('user-privileges') // Plural endpoint
@UseGuards(AuthGuard('jwt'))
export class UserPrivilegeController {
  constructor(private readonly userPrivilegeService: UserPrivilegeService) {}

  @Post()
  create(
    @Body() createDto: CreateUserPrivilegeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId } = req.user;
    // Note: createDto.userId refers to the user to whom the privilege is being assigned
    return this.userPrivilegeService.create(createDto, actingUserId, companyId);
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('userId', new ParseIntPipe({ optional: true })) targetUserId?: number, // User whose privileges are listed
    @Query('privilegeId', new ParseIntPipe({ optional: true })) privilegeId?: number,
  ) {
    const { companyId } = req.user;
    return this.userPrivilegeService.findAll(companyId, targetUserId, privilegeId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number, // ID of the user-privilege mapping record
    @Req() req: AuthenticatedRequest,
  ) {
    const { companyId } = req.user;
    return this.userPrivilegeService.findOne(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, // ID of the user-privilege mapping record
    @Body() updateDto: UpdateUserPrivilegeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId } = req.user;
    return this.userPrivilegeService.update(id, updateDto, actingUserId, companyId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number, // ID of the user-privilege mapping record
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId } = req.user;
    return this.userPrivilegeService.remove(id, companyId, actingUserId);
  }
}
