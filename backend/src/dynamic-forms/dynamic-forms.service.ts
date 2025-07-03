import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DynamicForm, DynamicFormField, Prisma } from '@prisma/client';
import { CreateDynamicFormWithFieldsDto } from './dto/create-dynamic-form.dto';
import { UpdateDynamicFormWithFieldsDto } from './dto/update-dynamic-form.dto';

interface FindAllFormsParams {
    companyId: number;
    page?: number;
    limit?: number;
    entityType?: string;
    masterTypeId?: number;
    status?: string; // For admin view to see inactive forms
    orderBy?: Prisma.DynamicFormOrderByWithRelationInput;
}

@Injectable()
export class DynamicFormsService {
  constructor(private prisma: PrismaService) {}

  private parseJsonStringSafe(jsonString: string | undefined, fieldName: string): Prisma.JsonValue | undefined {
    if (jsonString === undefined || jsonString === null) return undefined;
    try {
      return JSON.parse(jsonString) as Prisma.JsonValue;
    } catch (error) {
      throw new BadRequestException(`Invalid JSON format for ${fieldName}.`);
    }
  }

  async createFormWithFields(dto: CreateDynamicFormWithFieldsDto, actingUserId: number, companyId: number): Promise<DynamicForm> {
    if (dto.companyId && dto.companyId !== companyId) {
      throw new ForbiddenException('CompanyId mismatch for dynamic form creation.');
    }
    const existingFormByName = await this.prisma.dynamicForm.findFirst({
        where: { name: dto.name, companyId, status: { not: 'D' } } // Check active/inactive but not deleted
    });
    if (existingFormByName) {
        throw new ConflictException(`A dynamic form with name '${dto.name}' already exists in this company.`);
    }

    const { fields, ...formData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const newForm = await tx.dynamicForm.create({
        data: {
          ...formData,
          layout: this.parseJsonStringSafe(formData.layout, 'layout'),
          companyId: companyId,
          status: formData.status || 'A',
          createdBy: actingUserId,
          updatedBy: actingUserId,
        },
      });

      if (fields && fields.length > 0) {
        await tx.dynamicFormField.createMany({
          data: fields.map(fieldDto => ({
            ...fieldDto,
            formId: newForm.id,
            companyId: companyId, // Fields also get companyId for potential direct queries
            validation: this.parseJsonStringSafe(fieldDto.validation, `field ${fieldDto.key} validation`),
            options: this.parseJsonStringSafe(fieldDto.options, `field ${fieldDto.key} options`),
            status: fieldDto.status || 'A',
            createdBy: actingUserId,
            updatedBy: actingUserId,
          })),
        });
      }
      // Refetch with fields to return
      return tx.dynamicForm.findUniqueOrThrow({ where: { id: newForm.id }, include: { fields: { where: {status: 'A'}, orderBy: {orderIndex: 'asc'}} } });
    });
  }

  async findAllForms(params: FindAllFormsParams) {
    const { companyId, page = 1, limit = 10, entityType, masterTypeId, status, orderBy } = params;

    const whereClause: Prisma.DynamicFormWhereInput = { companyId };
    if (entityType) whereClause.entityType = entityType;
    if (masterTypeId) whereClause.masterTypeId = masterTypeId;
    if (status) whereClause.status = status; else whereClause.status = 'A'; // Default to active for general queries

    const totalRecords = await this.prisma.dynamicForm.count({ where: whereClause });
    const forms = await this.prisma.dynamicForm.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereClause,
      orderBy: orderBy || { name: 'asc' },
      include: { fields: { where: { status: 'A' }, orderBy: { orderIndex: 'asc' } } },
    });
     return {
        data: forms,
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
    };
  }

  async findFormById(id: number, companyId: number, includeInactiveFields: boolean = false): Promise<DynamicForm> {
    const form = await this.prisma.dynamicForm.findUnique({
      where: { id },
      include: {
          fields: {
              where: includeInactiveFields ? undefined : { status: 'A' },
              orderBy: { orderIndex: 'asc' }
            }
        },
    });
    if (!form || form.companyId !== companyId ) { // Also check status if only active forms are findable by ID for users
      throw new NotFoundException(`DynamicForm with ID ${id} not found in this company.`);
    }
    return form;
  }

  async findFormByName(name: string, companyId: number): Promise<DynamicForm> {
    const form = await this.prisma.dynamicForm.findFirst({
        where: { name, companyId, status: 'A' }, // Usually find active form by name
        include: { fields: { where: { status: 'A'}, orderBy: { orderIndex: 'asc' } } },
    });
     if (!form) {
      throw new NotFoundException(`DynamicForm with name '${name}' not found or inactive in this company.`);
    }
    return form;
  }

  async findFormsByEntityType(companyId: number, entityType: string, masterTypeId?: number): Promise<DynamicForm[]> {
    return this.prisma.dynamicForm.findMany({
      where: { companyId, entityType, masterTypeId: masterTypeId || undefined, status: 'A' },
      include: { fields: { where: { status: 'A' }, orderBy: { orderIndex: 'asc' } } },
    });
  }

  async updateFormWithFields(id: number, dto: UpdateDynamicFormWithFieldsDto, actingUserId: number, companyId: number): Promise<DynamicForm> {
    const existingForm = await this.findFormById(id, companyId, true); // Get even if form is inactive, with all fields

    const { fields, ...formData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const updatedForm = await tx.dynamicForm.update({
        where: { id },
        data: {
          ...formData,
          layout: this.parseJsonStringSafe(formData.layout, 'layout'),
          updatedBy: actingUserId,
        },
      });

      if (fields !== undefined) { // If fields array is provided, replace all
        await tx.dynamicFormField.deleteMany({ where: { formId: id } }); // Hard delete existing fields
        if (fields.length > 0) {
          await tx.dynamicFormField.createMany({
            data: fields.map(fieldDto => ({
              ...fieldDto,
              id: undefined, // Ensure new IDs are generated
              formId: id,
              companyId: companyId,
              validation: this.parseJsonStringSafe(fieldDto.validation, `field ${fieldDto.key} validation`),
              options: this.parseJsonStringSafe(fieldDto.options, `field ${fieldDto.key} options`),
              status: fieldDto.status || 'A',
              createdBy: actingUserId, // Consider if createdBy should be retained or if new fields are by current user
              updatedBy: actingUserId,
            })),
          });
        }
      }
      return tx.dynamicForm.findUniqueOrThrow({ where: {id}, include: { fields: {where: {status: 'A'}, orderBy: {orderIndex: 'asc'}}}});
    });
  }

  async removeForm(id: number, companyId: number, actingUserId: number): Promise<DynamicForm> {
    await this.findFormById(id, companyId); // Ensure form exists and belongs to company

    return this.prisma.$transaction(async (tx) => {
        // Soft delete associated fields first
        await tx.dynamicFormField.updateMany({
            where: { formId: id },
            data: { status: 'D', updatedBy: actingUserId }
        });
        // Then soft delete the form
        return tx.dynamicForm.update({
            where: { id },
            data: { status: 'D', updatedBy: actingUserId },
        });
    });
  }

  // getFormFields and validateFormData can remain similar, ensure they use active fields
  async getFormFields(formId: number, companyId: number): Promise<DynamicFormField[]> {
    await this.findFormById(formId, companyId); // Validate form access
    return this.prisma.dynamicFormField.findMany({
      where: { formId, status: 'A' },
      orderBy: { orderIndex: 'asc' },
    });
  }

  validateFormData(fields: DynamicFormField[], formData: any): { valid: boolean; errors?: Record<string, string> } {
    const errors: Record<string, string> = {};
    for (const field of fields) {
      const value = formData[field.key];
      if (field.required && (value === undefined || value === null || value === '')) {
        errors[field.key] = `${field.label} is required`;
        continue;
      }
      if ((value === undefined || value === null || value === '') && !field.required) {
        continue;
      }
      if (field.validation) {
        const validationRules = field.validation as Prisma.JsonObject; // Assuming it's already an object
        // ... (keep existing validation logic, ensure it handles Prisma.JsonObject correctly) ...
        // Example for minLength (assuming validationRules.minLength exists)
        if (validationRules && validationRules.minLength && typeof validationRules.minLength === 'number' && String(value).length < validationRules.minLength) {
            errors[field.key] = `${field.label} must be at least ${validationRules.minLength} characters`;
        }
        // Add more robust validation logic here based on Prisma.JsonObject structure
         if (validationRules && validationRules.pattern && typeof validationRules.pattern === 'string') {
            const regex = new RegExp(validationRules.pattern as string);
            if (!regex.test(String(value))) {
                errors[field.key] = (validationRules.message as string) || `${field.label} is not in the correct format`;
            }
        }
      }
    }
    return {
      valid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  }
}
