import { Injectable, NotFoundException, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateMasterDataDto } from './dto/create-master-data.dto';
import { UpdateMasterDataDto } from './dto/update-master-data.dto';
import { BusinessRulesService } from '../business-rules/business-rules.service';
import { DynamicFormsService } from '../dynamic-forms/dynamic-forms.service'; // Added

@Injectable()
export class MasterDataService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessRulesService: BusinessRulesService,
    private readonly dynamicFormsService: DynamicFormsService, // Injected
    ) {}

  private async validateAgainstDynamicForm(companyId: number, masterTypeId: number, data: CreateMasterDataDto | UpdateMasterDataDto) {
    // Check if a dynamic form is associated with this masterType
    // Assuming a convention for form names, e.g., `masterType_${masterTypeId}` or lookup
    // For this example, let's assume we look for a form with entityType 'masterData' and matching masterTypeId
    const forms = await this.dynamicFormsService.findFormsByEntityType(companyId, 'masterData', masterTypeId);
    if (forms && forms.length > 0) {
      const formToUse = forms[0]; // Assuming one form per masterType for now, or add more logic
      const formFields = await this.dynamicFormsService.getFormFields(formToUse.id, companyId);
      const validationResult = this.dynamicFormsService.validateFormData(formFields, data);
      if (!validationResult.valid) {
        throw new BadRequestException({ message: 'Dynamic form validation failed.', errors: validationResult.errors });
      }
    }
  }

  async create(createMasterDataDto: CreateMasterDataDto, userId: number, companyId: number) {
    // Dynamic Form Validation (before Business Rules via Interceptor)
    await this.validateAgainstDynamicForm(companyId, createMasterDataDto.masterTypeId, createMasterDataDto);

    // Business rules for 'beforeCreate' are handled by the interceptor
    // Ensure companyId from DTO matches user's companyId or DTO doesn't have it
    if (createMasterDataDto.companyId && createMasterDataDto.companyId !== companyId) {
        throw new NotFoundException('CompanyId mismatch');
    }
    const dataToCreate = {
      ...createMasterDataDto,
      companyId: companyId, // Always use user's companyId
      createdBy: userId,
      updatedBy: userId,
    };
    return this.prisma.masterdata.create({ data: dataToCreate });
  }

  async findAll(companyId: number) {
    return this.prisma.masterdata.findMany({
      where: { companyId, status: 'A' } // Assuming 'A' means active
    });
  }

  async findOne(id: number, companyId: number) {
    const masterItem = await this.prisma.masterdata.findUnique({
      where: { id }
    });
    if (!masterItem || masterItem.companyId !== companyId) {
      throw new NotFoundException(`MasterData with ID ${id} not found in this company.`);
    }
    return masterItem;
  }

  async update(id: number, updateMasterDataDto: UpdateMasterDataDto, userId: number, companyId: number) {
    const masterItem = await this.prisma.masterdata.findUnique({ where: { id } });
    if (!masterItem || masterItem.companyId !== companyId) {
      throw new NotFoundException(`MasterData with ID ${id} not found in this company.`);
    }

    // Prevent companyId from being changed via update
    const { companyId: dtoCompanyId, ...restOfDto } = updateMasterDataDto;

    const dataToUpdate = {
      ...restOfDto,
      updatedBy: userId,
    };
    return this.prisma.masterdata.update({
      where: { id },
      data: dataToUpdate
    });
  }

  async remove(id: number, companyId: number, userId: number) {
    const masterItem = await this.prisma.masterdata.findUnique({ where: { id } });
    if (!masterItem || masterItem.companyId !== companyId) {
      throw new NotFoundException(`MasterData with ID ${id} not found in this company.`);
    }
    // Instead of deleting, we can mark as inactive (soft delete)
    // This depends on the project requirements. For now, I'll implement soft delete.
    return this.prisma.masterdata.update({
      where: { id },
      data: {
        status: 'D', // Assuming 'D' means Deleted/Inactive
        updatedBy: userId
      },
    });
    // Original hard delete:
    // return this.prisma.masterdata.delete({ where: { id } });
  }
}
