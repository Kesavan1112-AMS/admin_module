import {
  Controller,
  Get,
  Post,
  Patch, // Changed from Put to Patch for partial updates
  Delete,
  Body,
  Param,
  UseGuards,
  Req, // Changed from Request to Req for consistency
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  UseInterceptors, // Added
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from '@nestjs/passport';
import { ApplyBusinessRules } from '../core/decorators/apply-business-rules.decorator'; // Added
import { BusinessRuleInterceptor } from '../core/interceptors/business-rule.interceptor'; // Added
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number; // Admin's companyId
    // roles?: string[]; // For RBAC, e.g. SUPER_ADMIN
  };
}

@Controller('companies') // Plural endpoint
@UseGuards(AuthGuard('jwt')) // All company operations should be protected
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // Typically, only a superadmin or system process can list ALL companies.
  // Regular admins might only see their own company.
  // This endpoint implies a superadmin capability.
  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest, // To check for superadmin role if needed
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    // TODO: Add role check here: if (!req.user.roles.includes('SUPER_ADMIN')) throw new ForbiddenException();
    const result = await this.companyService.findAll(page, limit);
    return {
      status: 1,
      msg: 'Companies retrieved successfully',
      data: result.data,
      totalRecords: result.totalRecords,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }

  // Get details of the currently authenticated user's company OR a specific company by ID if superadmin
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
     // TODO: Add role check: if admin, id must match req.user.companyId, unless superadmin
    // if (!req.user.roles.includes('SUPER_ADMIN') && id !== req.user.companyId) {
    //   throw new ForbiddenException("You can only view your own company's details.");
    // }
    const company = await this.companyService.findOne(id);
    return {
      status: 1,
      msg: 'Company retrieved successfully',
      data: [company], // Keep array format for consistency if frontend expects it
    };
  }

  // Get company by code (might be used for public-facing aspects or setup)
  // This might need different auth or be unprotected depending on use case
  @Get('by-code/:code')
  async findByCode(@Param('code') code: string, @Req() req: AuthenticatedRequest) {
    // Add auth checks as needed. If public, remove UseGuards for this route.
    // If for admin, ensure they have rights to query arbitrary codes.
    const company = await this.companyService.findByCode(code);
    return {
        status: 1,
        msg: 'Company retrieved successfully by code',
        data: [company],
    };
  }


  // Typically, only a superadmin can create new companies.
  @Post()
  async create(@Body() createDto: CreateCompanyDto, @Req() req: AuthenticatedRequest) {
    // TODO: Add role check here: if (!req.user.roles.includes('SUPER_ADMIN')) throw new ForbiddenException();
    const actingUserId = req.user.id;
    const company = await this.companyService.create(createDto, actingUserId);
    return {
      status: 1,
      msg: 'Company created successfully',
      data: [company],
    };
  }

  // Update a company. Admin updates their own, superadmin can update any.
  @Patch(':id') // Changed from Put to Patch
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCompanyDto,
    @Req() req: AuthenticatedRequest,
  ) {
    // TODO: Add role check: if admin, id must match req.user.companyId, unless superadmin
    // if (!req.user.roles.includes('SUPER_ADMIN') && id !== req.user.companyId) {
    //   throw new ForbiddenException("You can only update your own company's details.");
    // }
    const actingUserId = req.user.id;
    const company = await this.companyService.update(id, updateDto, actingUserId);
    return {
      status: 1,
      msg: 'Company updated successfully',
      data: [company],
    };
  }

  // Soft delete a company. Typically superadmin only.
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
     // TODO: Add role check here: if (!req.user.roles.includes('SUPER_ADMIN')) throw new ForbiddenException();
    const actingUserId = req.user.id;
    await this.companyService.delete(id, actingUserId);
    return {
      status: 1,
      msg: 'Company deactivated successfully', // Changed message
      data: [],
    };
  }

  // Removed configuration management endpoints from here.
  // They are handled by CompanyConfigurationController and UiConfigController.
}
