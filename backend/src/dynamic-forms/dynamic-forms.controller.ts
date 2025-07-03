import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { DynamicFormsService } from './dynamic-forms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('dynamic-forms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dynamic-forms')
export class DynamicFormsController {
  constructor(private readonly dynamicFormsService: DynamicFormsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new dynamic form' })
  @ApiResponse({ status: 201, description: 'The form has been successfully created.' })
  async createForm(@Request() req, @Body() createFormDto: any) {
    const { company, id } = req.user;
    return this.dynamicFormsService.createForm({
      ...createFormDto,
      company: { connect: { id: company } },
      createdBy: id,
      updatedBy: id,
      fields: {
        create: createFormDto.fields?.map(field => ({
          ...field,
          company: { connect: { id: company } },
          createdBy: id,
          updatedBy: id,
        })),
      },
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all dynamic forms for the company' })
  @ApiResponse({ status: 200, description: 'List of forms.' })
  async findAllForms(@Request() req) {
    const { company } = req.user;
    return this.dynamicFormsService.findAllForms(company);
  }

  @Get('by-entity-type/:entityType')
  @ApiOperation({ summary: 'Get forms by entity type' })
  @ApiResponse({ status: 200, description: 'Forms for the specified entity type.' })
  async findFormsByEntityType(
    @Request() req,
    @Param('entityType') entityType: string,
    @Query('masterTypeId') masterTypeId?: string,
  ) {
    const { company } = req.user;
    return this.dynamicFormsService.findFormsByEntityType(
      company,
      entityType,
      masterTypeId ? parseInt(masterTypeId, 10) : undefined,
    );
  }

  @Get('by-name/:name')
  @ApiOperation({ summary: 'Get form by name' })
  @ApiResponse({ status: 200, description: 'The form.' })
  @ApiResponse({ status: 404, description: 'Form not found.' })
  async findFormByName(@Request() req, @Param('name') name: string) {
    const { company } = req.user;
    return this.dynamicFormsService.findFormByName(company, name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a form by ID' })
  @ApiResponse({ status: 200, description: 'The form.' })
  @ApiResponse({ status: 404, description: 'Form not found.' })
  async findFormById(@Request() req, @Param('id') id: string) {
    const { company } = req.user;
    return this.dynamicFormsService.findFormById(company, +id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a form' })
  @ApiResponse({ status: 200, description: 'The form has been successfully updated.' })
  async updateForm(
    @Request() req,
    @Param('id') id: string,
    @Body() updateFormDto: any,
  ) {
    const { company, id: userId } = req.user;

    // Handle form fields updates separately
    const { fields, ...formData } = updateFormDto;
    
    if (fields && Array.isArray(fields)) {
      // Process each field
      for (const field of fields) {
        if (field.id) {
          // Update existing field
          await this.dynamicFormsService.updateField(field.id, {
            ...field,
            updatedBy: userId,
          });
        } else {
          // Create new field
          await this.dynamicFormsService.createField({
            ...field,
            form: { connect: { id: +id } },
            company: { connect: { id: company } },
            createdBy: userId,
            updatedBy: userId,
          });
        }
      }
    }

    return this.dynamicFormsService.updateForm(company, +id, {
      ...formData,
      updatedBy: userId,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a form' })
  @ApiResponse({ status: 200, description: 'The form has been successfully deleted.' })
  async removeForm(@Request() req, @Param('id') id: string) {
    const { company } = req.user;
    return this.dynamicFormsService.removeForm(company, +id);
  }

  @Post('field')
  @ApiOperation({ summary: 'Create a new form field' })
  @ApiResponse({ status: 201, description: 'The field has been successfully created.' })
  async createField(@Request() req, @Body() createFieldDto: any) {
    const { company, id } = req.user;
    return this.dynamicFormsService.createField({
      ...createFieldDto,
      company: { connect: { id: company } },
      createdBy: id,
      updatedBy: id,
    });
  }

  @Patch('field/:id')
  @ApiOperation({ summary: 'Update a form field' })
  @ApiResponse({ status: 200, description: 'The field has been successfully updated.' })
  async updateField(
    @Request() req,
    @Param('id') id: string,
    @Body() updateFieldDto: any,
  ) {
    const { id: userId } = req.user;
    return this.dynamicFormsService.updateField(+id, {
      ...updateFieldDto,
      updatedBy: userId,
    });
  }

  @Delete('field/:id')
  @ApiOperation({ summary: 'Delete a form field' })
  @ApiResponse({ status: 200, description: 'The field has been successfully deleted.' })
  async removeField(@Request() req, @Param('id') id: string) {
    return this.dynamicFormsService.removeField(+id);
  }

  @Post('validate/:formId')
  @ApiOperation({ summary: 'Validate data against a form' })
  @ApiResponse({ status: 200, description: 'Validation result.' })
  async validateFormData(
    @Request() req,
    @Param('formId') formId: string,
    @Body() formData: any,
  ) {
    const { company } = req.user;
    
    // Get the form and its fields
    const form = await this.dynamicFormsService.findFormById(company, +formId);
    if (!form) {
      return { valid: false, errors: { _form: 'Form not found' } };
    }
    
    // Fetch form fields if not already included
    const fields = await this.dynamicFormsService.getFormFields(+formId);
    
    // Validate the data against the form fields
    return this.dynamicFormsService.validateFormData(fields, formData);
  }
}
