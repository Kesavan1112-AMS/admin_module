import { Injectable, NotFoundException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { BusinessRulesService } from '../business-rules/business-rules.service'; // Added

@Injectable()
export class ModuleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessRulesService: BusinessRulesService, // Injected
    ) {}

  async create(createModuleDto: CreateModuleDto, userId: number, companyId: number) {
    if (createModuleDto.companyId && createModuleDto.companyId !== companyId) {
      throw new ForbiddenException('CompanyId mismatch for module creation.');
    }

    const dataToCreate = {
      ...createModuleDto,
      companyId: companyId, // Enforce companyId from token
      status: createModuleDto.status || 'A', // Default to Active
      createdBy: userId,
      updatedBy: userId,
    };
    return this.prisma.module.create({ data: dataToCreate });
  }

  async findAll(companyId: number) {
    return this.prisma.module.findMany({
      where: { companyId, status: 'A' }
    });
  }

  async findOne(id: number, companyId: number) {
    const moduleEntity = await this.prisma.module.findUnique({
      where: { id }
    });
    if (!moduleEntity || moduleEntity.companyId !== companyId) {
      throw new NotFoundException(`Module with ID ${id} not found in this company.`);
    }
    return moduleEntity;
  }

  async update(id: number, updateModuleDto: UpdateModuleDto, userId: number, companyId: number) {
    const moduleEntity = await this.prisma.module.findUnique({ where: { id } });
    if (!moduleEntity || moduleEntity.companyId !== companyId) {
      throw new NotFoundException(`Module with ID ${id} not found in this company.`);
    }

    const { companyId: dtoCompanyId, createdBy: dtoCreatedBy, ...restOfDto } = updateModuleDto;

    const dataToUpdate = {
      ...restOfDto,
      updatedBy: userId,
    };
    return this.prisma.module.update({
      where: { id },
      data: dataToUpdate
    });
  }

  async remove(id: number, companyId: number, userId: number) {
    const moduleEntity = await this.prisma.module.findUnique({ where: { id } });
    if (!moduleEntity || moduleEntity.companyId !== companyId) {
      throw new NotFoundException(`Module with ID ${id} not found in this company.`);
    }
    // Soft delete
    return this.prisma.module.update({
      where: { id },
      data: {
        status: 'D',
        updatedBy: userId
      },
    });
  }
}
