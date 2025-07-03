import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BusinessRulesService } from './business-rules.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('business-rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('business-rules')
export class BusinessRulesController {
  constructor(private readonly businessRulesService: BusinessRulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business rule' })
  @ApiResponse({ status: 201, description: 'The business rule has been successfully created.' })
  create(@Request() req, @Body() createBusinessRuleDto: any) {
    const { company, id } = req.user;
    return this.businessRulesService.create({
      ...createBusinessRuleDto,
      company: { connect: { id: company } },
      createdBy: id,
      updatedBy: id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all business rules for the company' })
  @ApiResponse({ status: 200, description: 'List of business rules.' })
  findAll(@Request() req) {
    const { company } = req.user;
    return this.businessRulesService.findAll(company);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a business rule by ID' })
  @ApiResponse({ status: 200, description: 'The business rule.' })
  @ApiResponse({ status: 404, description: 'Business rule not found.' })
  findOne(@Request() req, @Param('id') id: string) {
    const { company } = req.user;
    return this.businessRulesService.findOne(company, +id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a business rule' })
  @ApiResponse({ status: 200, description: 'The business rule has been successfully updated.' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBusinessRuleDto: any,
  ) {
    const { company, id: userId } = req.user;
    return this.businessRulesService.update(company, +id, {
      ...updateBusinessRuleDto,
      updatedBy: userId,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a business rule' })
  @ApiResponse({ status: 200, description: 'The business rule has been successfully deleted.' })
  remove(@Request() req, @Param('id') id: string) {
    const { company, id: userId } = req.user;
    return this.businessRulesService.remove(company, +id);
  }

  @Post('evaluate/:entityType/:eventType')
  @ApiOperation({ summary: 'Evaluate business rules for an entity' })
  @ApiResponse({ status: 200, description: 'Business rules evaluation result.' })
  async evaluateRules(
    @Request() req,
    @Param('entityType') entityType: string,
    @Param('eventType') eventType: string,
    @Body() entityData: any,
  ) {
    const { company } = req.user;
    return this.businessRulesService.processEntityRules(
      company,
      entityType,
      eventType,
      entityData,
    );
  }
}
