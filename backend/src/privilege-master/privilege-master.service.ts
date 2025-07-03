import { Injectable, NotFoundException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreatePrivilegeMasterDto } from './dto/create-privilege-master.dto';
import { UpdatePrivilegeMasterDto } from './dto/update-privilege-master.dto';
import { BusinessRulesService } from '../business-rules/business-rules.service'; // Added

@Injectable()
export class PrivilegeMasterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessRulesService: BusinessRulesService, // Injected
    ) {}

  async create(createPrivilegeDto: CreatePrivilegeMasterDto, userId: number, companyId: number) {
    if (createPrivilegeDto.companyId && createPrivilegeDto.companyId !== companyId) {
      throw new ForbiddenException('CompanyId mismatch for privilege creation.');
    }

    // Validate that the module exists and belongs to the same company
    const moduleEntity = await this.prisma.module.findUnique({ where: { id: createPrivilegeDto.moduleId } });
    if (!moduleEntity || moduleEntity.companyId !== companyId) {
      throw new NotFoundException(`Module with ID ${createPrivilegeDto.moduleId} not found in this company.`);
    }

    const dataToCreate = {
      ...createPrivilegeDto,
      companyId: companyId, // Enforce companyId from token
      status: createPrivilegeDto.status || 'A', // Default to Active
      createdBy: userId,
      updatedBy: userId,
    };
    return this.prisma.privilegemaster.create({ data: dataToCreate });
  }

  async findAll(companyId: number, moduleId?: number) {
    const whereClause: any = { companyId, status: 'A' };
    if (moduleId) {
      whereClause.moduleId = moduleId;
    }
    return this.prisma.privilegemaster.findMany({
      where: whereClause,
      include: { modules: true } // Optionally include module details
    });
  }

  async findOne(id: number, companyId: number) {
    const privilege = await this.prisma.privilegemaster.findUnique({
      where: { id },
      include: { modules: true }
    });
    if (!privilege || privilege.companyId !== companyId) {
      throw new NotFoundException(`Privilege with ID ${id} not found in this company.`);
    }
    return privilege;
  }

  async update(id: number, updatePrivilegeDto: UpdatePrivilegeMasterDto, userId: number, companyId: number) {
    const privilege = await this.prisma.privilegemaster.findUnique({ where: { id } });
    if (!privilege || privilege.companyId !== companyId) {
      throw new NotFoundException(`Privilege with ID ${id} not found in this company.`);
    }

    const { companyId: dtoCompanyId, moduleId: dtoModuleId, createdBy: dtoCreatedBy, ...restOfDto } = updatePrivilegeDto;

    if (dtoModuleId && dtoModuleId !== privilege.moduleId) {
        throw new ForbiddenException('Cannot change the moduleId of an existing privilege.');
    }

    const dataToUpdate = {
      ...restOfDto,
      updatedBy: userId,
    };
    return this.prisma.privilegemaster.update({
      where: { id },
      data: dataToUpdate
    });
  }

  async remove(id: number, companyId: number, userId: number) {
    const privilege = await this.prisma.privilegemaster.findUnique({ where: { id } });
    if (!privilege || privilege.companyId !== companyId) {
      throw new NotFoundException(`Privilege with ID ${id} not found in this company.`);
    }
    // Soft delete
    return this.prisma.privilegemaster.update({
      where: { id },
      data: {
        status: 'D',
        updatedBy: userId
      },
    });
  }
}
