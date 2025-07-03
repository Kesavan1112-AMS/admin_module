import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req, // Changed from Request
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Standardized guard
import { BusinessRulesService } from './business-rules.service';
import { CreateBusinessRuleDto } from './dto/create-business-rule.dto';
import { UpdateBusinessRuleDto } from './dto/update-business-rule.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request { // Standardized interface
  user: {
    id: number;
    companyId: number; // Standardized to companyId
  };
}

@ApiTags('business-rules')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt')) // Standardized guard
@Controller('business-rules')
export class BusinessRulesController {
  constructor(private readonly businessRulesService: BusinessRulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business rule' })
  @ApiResponse({ status: 201, description: 'The business rule has been successfully created.' })
  create(@Req() req: AuthenticatedRequest, @Body() createDto: CreateBusinessRuleDto) {
    const { companyId, id: actingUserId } = req.user;
    return this.businessRulesService.create(createDto, actingUserId, companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all business rules for the company' })
  @ApiResponse({ status: 200, description: 'List of business rules.' })
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('entityType') entityType?: string,
    @Query('eventType') eventType?: string,
    @Query('status') status?: string,
    ) {
    const { companyId } = req.user;
    return this.businessRulesService.findAll({ companyId, page, limit, entityType, eventType, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a business rule by ID' })
  @ApiResponse({ status: 200, description: 'The business rule.' })
  @ApiResponse({ status: 404, description: 'Business rule not found.' })
  findOne(@Req() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    const { companyId } = req.user;
    return this.businessRulesService.findOne(id, companyId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a business rule' })
  @ApiResponse({ status: 200, description: 'The business rule has been successfully updated.' })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateBusinessRuleDto,
  ) {
    const { companyId, id: actingUserId } = req.user;
    return this.businessRulesService.update(id, updateDto, actingUserId, companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a business rule (soft delete)' })
  @ApiResponse({ status: 200, description: 'The business rule has been successfully deactivated.' })
  remove(@Req() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    const { companyId, id: actingUserId } = req.user;
    return this.businessRulesService.remove(id, companyId, actingUserId);
  }

  @Post('evaluate/:entityType/:eventType')
  @ApiOperation({ summary: 'Evaluate business rules for an entity' })
  @ApiResponse({ status: 200, description: 'Business rules evaluation result.' })
  async evaluateRules(
    @Req() req: AuthenticatedRequest,
    @Param('entityType') entityType: string,
    @Param('eventType') eventType: string,
    @Body() entityData: any, // Data for the entity being evaluated
  ) {
    const { companyId } = req.user;
    return this.businessRulesService.processEntityRules(
      companyId,
      entityType,
      eventType,
      entityData,
    );
  }
}
