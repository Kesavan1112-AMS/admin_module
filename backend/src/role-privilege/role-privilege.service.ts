import { Injectable, NotFoundException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateRolePrivilegeDto } from './dto/create-role-privilege.dto';
import { UpdateRolePrivilegeDto } from './dto/update-role-privilege.dto';
import { BusinessRulesService } from '../business-rules/business-rules.service'; // Added

@Injectable()
export class RolePrivilegeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessRulesService: BusinessRulesService, // Injected
    ) {}

  async create(createDto: CreateRolePrivilegeDto, actingUserId: number, companyId: number) {
    if (createDto.companyId && createDto.companyId !== companyId) {
      throw new ForbiddenException('CompanyId mismatch for role-privilege creation.');
    }

    // Validate UserCategory
    const userCategory = await this.prisma.usercategories.findUnique({ where: { id: createDto.userCategoryId } });
    if (!userCategory || userCategory.companyId !== companyId) {
      throw new NotFoundException(`UserCategory with ID ${createDto.userCategoryId} not found in this company.`);
    }

    // Validate Privilege
    const privilege = await this.prisma.privilegemaster.findUnique({ where: { id: createDto.privilegeId } });
    if (!privilege || privilege.companyId !== companyId) {
      throw new NotFoundException(`Privilege with ID ${createDto.privilegeId} not found in this company.`);
    }

    // Check if this role-privilege combination already exists for the company
    const existingMapping = await this.prisma.roleprivileges.findFirst({
      where: {
        companyId: companyId,
        userCategoryId: createDto.userCategoryId,
        privilegeId: createDto.privilegeId,
        status: 'A' // Check against active ones
      }
    });

    if (existingMapping) {
      throw new ForbiddenException('This role-privilege mapping already exists and is active for the company.');
    }


    const dataToCreate = {
      ...createDto,
      companyId: companyId,
      status: createDto.status || 'A',
      grantedBy: actingUserId,
      createdBy: actingUserId,
      updatedBy: actingUserId,
    };
    return this.prisma.roleprivileges.create({ data: dataToCreate });
  }

  async findAll(companyId: number, userCategoryId?: number, privilegeId?: number) {
    const whereClause: any = { companyId, status: 'A' };
    if (userCategoryId) {
      whereClause.userCategoryId = userCategoryId;
    }
    if (privilegeId) {
      whereClause.privilegeId = privilegeId;
    }
    return this.prisma.roleprivileges.findMany({
      where: whereClause,
      include: {
        usercategories: true,
        privilegemaster: { include: { modules: true } }
      },
    });
  }

  async findOne(id: number, companyId: number) {
    const rolePrivilege = await this.prisma.roleprivileges.findUnique({
      where: { id },
      include: {
        usercategories: true,
        privilegemaster: { include: { modules: true } }
      },
    });
    if (!rolePrivilege || rolePrivilege.companyId !== companyId) {
      throw new NotFoundException(`RolePrivilege with ID ${id} not found in this company.`);
    }
    return rolePrivilege;
  }

  async update(id: number, updateDto: UpdateRolePrivilegeDto, actingUserId: number, companyId: number) {
    const rolePrivilege = await this.prisma.roleprivileges.findUnique({ where: { id } });
    if (!rolePrivilege || rolePrivilege.companyId !== companyId) {
      throw new NotFoundException(`RolePrivilege with ID ${id} not found in this company.`);
    }

    const {
        companyId: dtoCompanyId,
        userCategoryId: dtoUserCategoryId,
        privilegeId: dtoPrivilegeId,
        createdBy: dtoCreatedBy,
        grantedBy: dtoGrantedBy,
        ...restOfDto
    } = updateDto;

    if (dtoUserCategoryId && dtoUserCategoryId !== rolePrivilege.userCategoryId) {
        throw new ForbiddenException('Cannot change the userCategoryId of an existing role-privilege mapping.');
    }
    if (dtoPrivilegeId && dtoPrivilegeId !== rolePrivilege.privilegeId) {
        throw new ForbiddenException('Cannot change the privilegeId of an existing role-privilege mapping.');
    }

    const dataToUpdate = {
      ...restOfDto, // only status can be updated effectively
      updatedBy: actingUserId,
    };
    return this.prisma.roleprivileges.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number, companyId: number, actingUserId: number) {
    const rolePrivilege = await this.prisma.roleprivileges.findUnique({ where: { id } });
    if (!rolePrivilege || rolePrivilege.companyId !== companyId) {
      throw new NotFoundException(`RolePrivilege with ID ${id} not found in this company.`);
    }
    return this.prisma.roleprivileges.update({
      where: { id },
      data: {
        status: 'D',
        updatedBy: actingUserId,
      },
    });
  }
}
