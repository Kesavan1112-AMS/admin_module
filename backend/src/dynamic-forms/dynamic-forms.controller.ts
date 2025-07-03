import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req, // Standardized
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Standardized
import { DynamicFormsService } from './dynamic-forms.service';
import { CreateDynamicFormWithFieldsDto } from './dto/create-dynamic-form.dto';
import { UpdateDynamicFormWithFieldsDto } from './dto/update-dynamic-form.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request { // Standardized
  user: {
    id: number;
    companyId: number;
  };
}

@ApiTags('dynamic-forms')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt')) // Standardized
@Controller('dynamic-forms')
export class DynamicFormsController {
  constructor(private readonly dynamicFormsService: DynamicFormsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new dynamic form with its fields' })
  @ApiResponse({ status: 201, description: 'The form has been successfully created.' })
  async createFormWithFields(@Req() req: AuthenticatedRequest, @Body() createDto: CreateDynamicFormWithFieldsDto) {
    const { companyId, id: actingUserId } = req.user;
    return this.dynamicFormsService.createFormWithFields(createDto, actingUserId, companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all dynamic forms for the company' })
  @ApiResponse({ status: 200, description: 'List of forms.' })
  async findAllForms(
    @Req() req: AuthenticatedRequest,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('entityType') entityType?: string,
    @Query('masterTypeId', new ParseIntPipe({ optional: true })) masterTypeId?: number,
    @Query('status') status?: string, // For admin to view inactive/all
    ) {
    const { companyId } = req.user;
    return this.dynamicFormsService.findAllForms({ companyId, page, limit, entityType, masterTypeId, status });
  }

  @Get('by-entity-type/:entityType')
  @ApiOperation({ summary: 'Get active forms by entity type' })
  @ApiResponse({ status: 200, description: 'Forms for the specified entity type.' })
  async findFormsByEntityType(
    @Req() req: AuthenticatedRequest,
    @Param('entityType') entityType: string,
    @Query('masterTypeId', new ParseIntPipe({ optional: true })) masterTypeId?: number,
  ) {
    const { companyId } = req.user;
    return this.dynamicFormsService.findFormsByEntityType(companyId, entityType, masterTypeId);
  }

  @Get('by-name/:name')
  @ApiOperation({ summary: 'Get an active form by name' })
  @ApiResponse({ status: 200, description: 'The form.' })
  @ApiResponse({ status: 404, description: 'Form not found.' })
  async findFormByName(@Req() req: AuthenticatedRequest, @Param('name') name: string) {
    const { companyId } = req.user;
    return this.dynamicFormsService.findFormByName(name, companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a form by ID (includes fields)' })
  @ApiResponse({ status: 200, description: 'The form with its fields.' })
  @ApiResponse({ status: 404, description: 'Form not found.' })
  async findFormById(@Req() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    const { companyId } = req.user;
    // Admin might want to see inactive fields, so pass true
    // const includeInactiveFields = req.user.roles.includes('admin'); // Example
    return this.dynamicFormsService.findFormById(id, companyId, true);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a form and its fields (uses replace strategy for fields)' })
  @ApiResponse({ status: 200, description: 'The form has been successfully updated.' })
  async updateFormWithFields(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDynamicFormWithFieldsDto,
  ) {
    const { companyId, id: actingUserId } = req.user;
    return this.dynamicFormsService.updateFormWithFields(id, updateDto, actingUserId, companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a form and its fields (soft delete)' })
  @ApiResponse({ status: 200, description: 'The form has been successfully deactivated.' })
  async removeForm(@Req() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    const { companyId, id: actingUserId } = req.user;
    return this.dynamicFormsService.removeForm(id, companyId, actingUserId);
  }

  // Standalone field CRUD endpoints are removed as fields are managed with the form.

  @Post('validate/:formId')
  @ApiOperation({ summary: 'Validate data against a dynamic form' })
  @ApiResponse({ status: 200, description: 'Validation result.' })
  async validateFormData(
    @Req() req: AuthenticatedRequest,
    @Param('formId', ParseIntPipe) formId: number,
    @Body() formData: any,
  ) {
    const { companyId } = req.user;
    // Service's getFormFields already validates formId and companyId
    const fields = await this.dynamicFormsService.getFormFields(formId, companyId);
    return this.dynamicFormsService.validateFormData(fields, formData);
  }
}
