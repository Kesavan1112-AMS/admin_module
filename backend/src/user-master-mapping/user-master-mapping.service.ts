import { Injectable, NotFoundException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateUserMasterMappingDto } from './dto/create-user-master-mapping.dto';
import { UpdateUserMasterMappingDto } from './dto/update-user-master-mapping.dto';
import { BusinessRulesService } from '../business-rules/business-rules.service'; // Added

@Injectable()
export class UserMasterMappingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessRulesService: BusinessRulesService, // Injected
    ) {}

  async create(createUserMasterMappingDto: CreateUserMasterMappingDto, actingUserId: number, companyId: number) {
    if (createUserMasterMappingDto.companyId && createUserMasterMappingDto.companyId !== companyId) {
      throw new ForbiddenException('CompanyId mismatch for user-master mapping creation.');
    }

    // Validate that the user being mapped and masterData being mapped belong to the same company
    const userToMap = await this.prisma.user.findUnique({ where: { id: createUserMasterMappingDto.userId }});
    if (!userToMap || userToMap.companyId !== companyId) {
        throw new NotFoundException(`User with ID ${createUserMasterMappingDto.userId} not found in this company.`);
    }
    const masterDataToMap = await this.prisma.masterdata.findUnique({ where: { id: createUserMasterMappingDto.masterDataId }});
    if (!masterDataToMap || masterDataToMap.companyId !== companyId) {
        throw new NotFoundException(`MasterData with ID ${createUserMasterMappingDto.masterDataId} not found in this company.`);
    }

    const dataToCreate = {
      ...createUserMasterMappingDto,
      companyId: companyId, // Enforce companyId from token
      status: createUserMasterMappingDto.status || 'A', // Default to Active
      grantedBy: actingUserId,
      createdBy: actingUserId,
      updatedBy: actingUserId,
    };
    return this.prisma.usermastermappings.create({ data: dataToCreate });
  }

  async findAll(companyId: number, mappedUserId?: number, masterDataId?: number) {
    const whereClause: any = { companyId, status: 'A' };
    if (mappedUserId) {
      whereClause.userId = mappedUserId;
    }
    if (masterDataId) {
      whereClause.masterDataId = masterDataId;
    }
    return this.prisma.usermastermappings.findMany({ where: whereClause });
  }

  async findOne(id: number, companyId: number) {
    const mapping = await this.prisma.usermastermappings.findUnique({
      where: { id }
    });
    if (!mapping || mapping.companyId !== companyId) {
      throw new NotFoundException(`UserMasterMapping with ID ${id} not found in this company.`);
    }
    return mapping;
  }

  async update(id: number, updateUserMasterMappingDto: UpdateUserMasterMappingDto, actingUserId: number, companyId: number) {
    const mapping = await this.prisma.usermastermappings.findUnique({ where: { id } });
    if (!mapping || mapping.companyId !== companyId) {
      throw new NotFoundException(`UserMasterMapping with ID ${id} not found in this company.`);
    }

    // Prevent critical fields from being changed
    const {
        companyId: dtoCompanyId,
        userId: dtoUserId,
        masterDataId: dtoMasterDataId,
        createdBy: dtoCreatedBy,
        grantedBy: dtoGrantedBy,
        ...restOfDto
    } = updateUserMasterMappingDto;

    if (dtoUserId && dtoUserId !== mapping.userId) {
        throw new ForbiddenException('Cannot change the mapped user (userId) of an existing mapping.');
    }
    if (dtoMasterDataId && dtoMasterDataId !== mapping.masterDataId) {
        throw new ForbiddenException('Cannot change the masterDataId of an existing mapping.');
    }

    const dataToUpdate = {
      ...restOfDto,
      updatedBy: actingUserId,
    };
    return this.prisma.usermastermappings.update({
      where: { id },
      data: dataToUpdate
    });
  }

  async remove(id: number, companyId: number, actingUserId: number) {
    const mapping = await this.prisma.usermastermappings.findUnique({ where: { id } });
    if (!mapping || mapping.companyId !== companyId) {
      throw new NotFoundException(`UserMasterMapping with ID ${id} not found in this company.`);
    }
    // Soft delete
    return this.prisma.usermastermappings.update({
      where: { id },
      data: {
        status: 'D',
        updatedBy: actingUserId
      },
    });
  }
}
