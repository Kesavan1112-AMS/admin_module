import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DynamicForm, DynamicFormField, Prisma } from '@prisma/client';

@Injectable()
export class DynamicFormsService {
  constructor(private prisma: PrismaService) {}

  async createForm(data: Prisma.DynamicFormCreateInput): Promise<DynamicForm> {
    return this.prisma.dynamicForm.create({
      data,
      include: {
        fields: true,
      },
    });
  }

  async findAllForms(companyId: number, params: {
    skip?: number;
    take?: number;
    where?: Prisma.DynamicFormWhereInput;
    orderBy?: Prisma.DynamicFormOrderByWithRelationInput;
  } = {}) {
    const { skip, take, where, orderBy } = params;
    return this.prisma.dynamicForm.findMany({
      skip,
      take,
      where: {
        ...where,
        companyId,
        status: 'A',
      },
      orderBy,
      include: {
        fields: {
          where: {
            status: 'A',
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });
  }

  async findFormById(companyId: number, id: number): Promise<DynamicForm | null> {
    return this.prisma.dynamicForm.findFirst({
      where: {
        id,
        companyId,
        status: 'A',
      },
      include: {
        fields: {
          where: {
            status: 'A',
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });
  }

  async findFormByName(companyId: number, name: string): Promise<DynamicForm | null> {
    return this.prisma.dynamicForm.findFirst({
      where: {
        name,
        companyId,
        status: 'A',
      },
      include: {
        fields: {
          where: {
            status: 'A',
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });
  }

  async findFormsByEntityType(companyId: number, entityType: string, masterTypeId?: number): Promise<DynamicForm[]> {
    return this.prisma.dynamicForm.findMany({
      where: {
        companyId,
        entityType,
        masterTypeId: masterTypeId || undefined,
        status: 'A',
      },
      include: {
        fields: {
          where: {
            status: 'A',
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });
  }

  async updateForm(companyId: number, id: number, data: Prisma.DynamicFormUpdateInput): Promise<DynamicForm> {
    return this.prisma.dynamicForm.update({
      where: {
        id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        fields: true,
      },
    });
  }

  async removeForm(companyId: number, id: number): Promise<DynamicForm> {
    // Soft delete the form by setting status to 'I'
    return this.prisma.dynamicForm.update({
      where: {
        id,
      },
      data: {
        status: 'I',
        updatedAt: new Date(),
      },
    });
  }

  // Form Field Operations
  async createField(data: Prisma.DynamicFormFieldCreateInput): Promise<DynamicFormField> {
    return this.prisma.dynamicFormField.create({
      data,
    });
  }

  async updateField(id: number, data: Prisma.DynamicFormFieldUpdateInput): Promise<DynamicFormField> {
    return this.prisma.dynamicFormField.update({
      where: {
        id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async removeField(id: number): Promise<DynamicFormField> {
    return this.prisma.dynamicFormField.update({
      where: {
        id,
      },
      data: {
        status: 'I',
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get form fields with their validation and options
   */
  async getFormFields(formId: number): Promise<DynamicFormField[]> {
    return this.prisma.dynamicFormField.findMany({
      where: {
        formId,
        status: 'A',
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });
  }

  /**
   * Validate form data against field definitions
   */
  validateFormData(fields: DynamicFormField[], formData: any): { valid: boolean; errors?: Record<string, string> } {
    const errors: Record<string, string> = {};

    for (const field of fields) {
      const value = formData[field.key];
      
      // Check required fields
      if (field.required && (value === undefined || value === null || value === '')) {
        errors[field.key] = `${field.label} is required`;
        continue;
      }

      // Skip validation for empty optional fields
      if ((value === undefined || value === null || value === '') && !field.required) {
        continue;
      }

      // Validate based on field type and validation rules
      if (field.validation) {
        const validation = field.validation as any;
        
        switch (field.type) {
          case 'text':
          case 'textarea':
            if (validation.minLength && String(value).length < validation.minLength) {
              errors[field.key] = `${field.label} must be at least ${validation.minLength} characters`;
            }
            if (validation.maxLength && String(value).length > validation.maxLength) {
              errors[field.key] = `${field.label} must be at most ${validation.maxLength} characters`;
            }
            if (validation.pattern) {
              const regex = new RegExp(validation.pattern);
              if (!regex.test(String(value))) {
                errors[field.key] = validation.message || `${field.label} is not in the correct format`;
              }
            }
            break;
            
          case 'number':
            const numValue = Number(value);
            if (isNaN(numValue)) {
              errors[field.key] = `${field.label} must be a number`;
            } else {
              if (validation.min !== undefined && numValue < validation.min) {
                errors[field.key] = `${field.label} must be at least ${validation.min}`;
              }
              if (validation.max !== undefined && numValue > validation.max) {
                errors[field.key] = `${field.label} must be at most ${validation.max}`;
              }
            }
            break;
            
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(String(value))) {
              errors[field.key] = `${field.label} must be a valid email address`;
            }
            break;
            
          case 'date':
            if (isNaN(Date.parse(value))) {
              errors[field.key] = `${field.label} must be a valid date`;
            } else {
              const dateValue = new Date(value);
              if (validation.minDate && dateValue < new Date(validation.minDate)) {
                errors[field.key] = `${field.label} must be after ${new Date(validation.minDate).toLocaleDateString()}`;
              }
              if (validation.maxDate && dateValue > new Date(validation.maxDate)) {
                errors[field.key] = `${field.label} must be before ${new Date(validation.maxDate).toLocaleDateString()}`;
              }
            }
            break;
            
          case 'select':
          case 'radio':
            if (field.options) {
              const options = (field.options as any).items;
              if (Array.isArray(options) && !options.some(opt => opt.value === value)) {
                errors[field.key] = `${field.label} must be one of the allowed values`;
              }
            }
            break;
            
          case 'checkbox':
            if (validation.required && !value) {
              errors[field.key] = `${field.label} must be checked`;
            }
            break;
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  }
}
