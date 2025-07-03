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
  DefaultValuePipe,
  ForbiddenException,
  UseInterceptors, // Added
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { ApplyBusinessRules } from '../core/decorators/apply-business-rules.decorator'; // Added
import { BusinessRuleInterceptor } from '../core/interceptors/business-rule.interceptor'; // Added
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number;
    // roles?: string[]; // For RBAC
  };
}

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Admin creates a new user
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId: actingUserCompanyId } = req.user;
    // Add role-based check here if only certain roles can create users
    // e.g., if (!req.user.roles.includes('ADMIN')) throw new ForbiddenException();
    return this.userService.createByUserAdmin(createUserDto, actingUserId, actingUserCompanyId);
  }

  // Get all users in the admin's company (paginated)
  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const { companyId } = req.user;
    // Add role-based check here if needed
    return this.userService.findAllInCompany(companyId, page, limit);
  }

  // Get a specific user by ID (within the admin's company)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { companyId } = req.user;
    // Add role-based check here if needed
    return this.userService.findOneInCompany(id, companyId);
  }

  // Update a user (by admin)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId: actingUserCompanyId } = req.user;
    // Add role-based check here
    return this.userService.updateUser(id, updateUserDto, actingUserId, actingUserCompanyId);
  }

  // Deactivate a user (soft delete by admin)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId: actingUserCompanyId } = req.user;
    // Add role-based check here
    return this.userService.deactivateUser(id, actingUserId, actingUserCompanyId);
  }
}
