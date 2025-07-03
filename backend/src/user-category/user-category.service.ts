import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateUserCategoryDto } from './dto/create-user-category.dto';
import { UpdateUserCategoryDto } from './dto/update-user-category.dto';
import { BusinessRulesService } from '../business-rules/business-rules.service'; // Added

@Injectable()
export class UserCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessRulesService: BusinessRulesService, // Injected
    ) {}

  async create(createUserCategoryDto: CreateUserCategoryDto, userId: number, companyId: number) {
    // Business rules for 'beforeCreate' handled by interceptor
    // Ensure companyId from DTO matches user's companyId or DTO doesn't have it / is being set by system
    if (createUserCategoryDto.companyId && createUserCategoryDto.companyId !== companyId) {
        throw new NotFoundException('CompanyId mismatch for user category creation.');
    }

    const dataToCreate = {
      ...createUserCategoryDto,
      companyId: companyId, // Enforce companyId from token
      status: createUserCategoryDto.status || 'A', // Default to Active
      createdBy: userId,
      updatedBy: userId,
    };
    return this.prisma.usercategories.create({ data: dataToCreate });
  }

  async findAll(companyId: number) {
    return this.prisma.usercategories.findMany({
      where: { companyId, status: 'A' } // Assuming 'A' means active
    });
  }

  async findOne(id: number, companyId: number) {
    const userCategory = await this.prisma.usercategories.findUnique({
      where: { id }
    });
    if (!userCategory || userCategory.companyId !== companyId) {
      throw new NotFoundException(`UserCategory with ID ${id} not found in this company.`);
    }
    return userCategory;
  }

  async update(id: number, updateUserCategoryDto: UpdateUserCategoryDto, userId: number, companyId: number) {
    const userCategory = await this.prisma.usercategories.findUnique({ where: { id } });
    if (!userCategory || userCategory.companyId !== companyId) {
      throw new NotFoundException(`UserCategory with ID ${id} not found in this company.`);
    }

    // Prevent companyId from being changed via update
    const { companyId: dtoCompanyId, createdBy: dtoCreatedBy, ...restOfDto } = updateUserCategoryDto;

    const dataToUpdate = {
      ...restOfDto,
      updatedBy: userId,
    };
    return this.prisma.usercategories.update({
      where: { id },
      data: dataToUpdate
    });
  }

  async remove(id: number, companyId: number, userId: number) {
    const userCategory = await this.prisma.usercategories.findUnique({ where: { id } });
    if (!userCategory || userCategory.companyId !== companyId) {
      throw new NotFoundException(`UserCategory with ID ${id} not found in this company.`);
    }
    // Soft delete
    return this.prisma.usercategories.update({
      where: { id },
      data: {
        status: 'D', // Assuming 'D' means Deleted/Inactive
        updatedBy: userId
      },
    });
    // Original hard delete:
    // return this.prisma.usercategories.delete({ where: { id } });
  }
}
