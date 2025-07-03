import { Injectable, NotFoundException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateUserPrivilegeDto } from './dto/create-user-privilege.dto';
import { UpdateUserPrivilegeDto } from './dto/update-user-privilege.dto';
import { UserService } from '../user/user.service';
import { RolePrivilegeService } from '../role-privilege/role-privilege.service';
import { BusinessRulesService } from '../business-rules/business-rules.service'; // Added

@Injectable()
export class UserPrivilegeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly rolePrivilegeService: RolePrivilegeService,
    private readonly businessRulesService: BusinessRulesService, // Injected
    ) {}

  async create(createDto: CreateUserPrivilegeDto, actingUserId: number, companyId: number) {
    if (createDto.companyId && createDto.companyId !== companyId) {
      throw new ForbiddenException('CompanyId mismatch for user-privilege creation.');
    }

    // Validate User to whom privilege is assigned
    const targetUser = await this.prisma.user.findUnique({ where: { id: createDto.userId } });
    if (!targetUser || targetUser.companyId !== companyId) {
      throw new NotFoundException(`Target user with ID ${createDto.userId} not found in this company.`);
    }

    // Validate Privilege
    const privilegeMaster = await this.prisma.privilegemaster.findUnique({ where: { id: createDto.privilegeId } });
    if (!privilegeMaster || privilegeMaster.companyId !== companyId) {
      throw new NotFoundException(`Privilege with ID ${createDto.privilegeId} not found in this company.`);
    }

    // Check if this user-privilege combination already exists for the company
    const existingMapping = await this.prisma.userprivileges.findFirst({
        where: {
          companyId: companyId,
          userId: createDto.userId,
          privilegeId: createDto.privilegeId,
          status: 'A' // Check against active ones
        }
      });

    if (existingMapping) {
        throw new ForbiddenException('This user-privilege mapping already exists and is active for the company.');
    }

    const dataToCreate = {
      ...createDto,
      companyId: companyId,
      status: createDto.status || 'A',
      grantedBy: actingUserId,
      createdBy: actingUserId,
      updatedBy: actingUserId,
    };
    return this.prisma.userprivileges.create({ data: dataToCreate });
  }

  async findAll(companyId: number, targetUserId?: number, privilegeId?: number) {
    const whereClause: any = { companyId, status: 'A' };
    if (targetUserId) {
      whereClause.userId = targetUserId;
    }
    if (privilegeId) {
      whereClause.privilegeId = privilegeId;
    }
    return this.prisma.userprivileges.findMany({
      where: whereClause,
      include: {
        users_userprivileges_userIdTousers: { select: { id: true, username: true, email: true } }, // Select specific user fields
        privilegemaster: { include: { modules: true } },
      },
    });
  }

  async findOne(id: number, companyId: number) {
    const userPrivilege = await this.prisma.userprivileges.findUnique({
      where: { id },
      include: {
        users_userprivileges_userIdTousers: { select: { id: true, username: true, email: true } },
        privilegemaster: { include: { modules: true } },
      },
    });
    if (!userPrivilege || userPrivilege.companyId !== companyId) {
      throw new NotFoundException(`UserPrivilege with ID ${id} not found in this company.`);
    }
    return userPrivilege;
  }

  async update(id: number, updateDto: UpdateUserPrivilegeDto, actingUserId: number, companyId: number) {
    const userPrivilege = await this.prisma.userprivileges.findUnique({ where: { id } });
    if (!userPrivilege || userPrivilege.companyId !== companyId) {
      throw new NotFoundException(`UserPrivilege with ID ${id} not found in this company.`);
    }

    const {
      companyId: dtoCompanyId,
      userId: dtoUserId, // User to whom privilege is assigned
      privilegeId: dtoPrivilegeId,
      createdBy: dtoCreatedBy,
      grantedBy: dtoGrantedBy,
      ...restOfDto
    } = updateDto;

    if (dtoUserId && dtoUserId !== userPrivilege.userId) {
      throw new ForbiddenException('Cannot change the target user (userId) of an existing user-privilege mapping.');
    }
    if (dtoPrivilegeId && dtoPrivilegeId !== userPrivilege.privilegeId) {
      throw new ForbiddenException('Cannot change the privilegeId of an existing user-privilege mapping.');
    }

    const dataToUpdate = {
      ...restOfDto, // Can update status, overrideReason, expiresAt
      updatedBy: actingUserId,
    };
    return this.prisma.userprivileges.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number, companyId: number, actingUserId: number) {
    const userPrivilege = await this.prisma.userprivileges.findUnique({ where: { id } });
    if (!userPrivilege || userPrivilege.companyId !== companyId) {
      throw new NotFoundException(`UserPrivilege with ID ${id} not found in this company.`);
    }
    return this.prisma.userprivileges.update({
      where: { id },
      data: {
        status: 'D',
        updatedBy: actingUserId,
      },
    });
  }
}
