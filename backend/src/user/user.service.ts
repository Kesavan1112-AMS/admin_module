import { Injectable, NotFoundException, ConflictException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { BusinessRulesService } from '../business-rules/business-rules.service'; // Added

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessRulesService: BusinessRulesService, // Injected
    ) {}

  async findByUsername(companyId: number, username: string) {
    return this.prisma.user.findUnique({
      where: { companyId_username: { companyId, username } },
      include: { userCategory: true, company: true } // Include relations for context
    });
  }

  async findByEmail(companyId: number, email: string) {
    return this.prisma.user.findUnique({
      where: { companyId_email: { companyId, email } },
      include: { userCategory: true, company: true } // Include relations for context
    });
  }

  // This method is used by AuthService for self-registration or initial seed.
  // It needs to ensure password is hashed and basic fields are set.
  async createUserForRegistration(data: CreateUserDto & { passwordHash: string, companyId: number }) {
    const { password, ...userData } = data; // password field from CreateUserDto is not used here

    const existingUserByUsername = await this.findByUsername(userData.companyId, userData.username);
    if (existingUserByUsername) {
      throw new ConflictException(`Username '${userData.username}' already exists in this company.`);
    }
    const existingUserByEmail = await this.findByEmail(userData.companyId, userData.email);
    if (existingUserByEmail) {
      throw new ConflictException(`Email '${userData.email}' already exists in this company.`);
    }

    // Validate userCategoryId
    const userCategory = await this.prisma.usercategories.findUnique({ where: { id: userData.userCategoryId }});
    if (!userCategory || userCategory.companyId !== userData.companyId) {
        throw new NotFoundException(`UserCategory with ID ${userData.userCategoryId} not found in this company.`);
    }

    const userToCreate = {
        ...userData,
        status: userData.status || 'A',
        // For self-registration, createdBy/updatedBy might be the user themselves or null initially
        // If an admin is seeding, these could be set. For now, let's assume self or system.
        // createdBy: data.createdBy !== undefined ? data.createdBy : null, // Or set to new user's ID post-creation
        // updatedBy: data.updatedBy !== undefined ? data.updatedBy : null,
    };
    const createdUser = await this.prisma.user.create({ data: userToCreate });
    // If createdBy/updatedBy should be self, update here:
    // return this.prisma.user.update({ where: {id: createdUser.id }, data: { createdBy: createdUser.id, updatedBy: createdUser.id }});
    return createdUser;
  }


  async createByUserAdmin(createDto: CreateUserDto, actingUserId: number, actingUserCompanyId: number) {
    if (createDto.companyId && createDto.companyId !== actingUserCompanyId) {
      throw new ForbiddenException("Admin cannot create user for another company.");
    }

    const existingUserByUsername = await this.findByUsername(actingUserCompanyId, createDto.username);
    if (existingUserByUsername) {
      throw new ConflictException(`Username '${createDto.username}' already exists in this company.`);
    }
    const existingUserByEmail = await this.findByEmail(actingUserCompanyId, createDto.email);
    if (existingUserByEmail) {
      throw new ConflictException(`Email '${createDto.email}' already exists in this company.`);
    }

    const userCategory = await this.prisma.usercategories.findUnique({ where: { id: createDto.userCategoryId }});
    if (!userCategory || userCategory.companyId !== actingUserCompanyId) {
        throw new NotFoundException(`UserCategory with ID ${createDto.userCategoryId} not found in this company.`);
    }

    const passwordHash = await bcrypt.hash(createDto.password, 10);
    const dataToCreate = {
        username: createDto.username,
        email: createDto.email,
        passwordHash: passwordHash,
        firstName: createDto.firstName,
        lastName: createDto.lastName,
        phone: createDto.phone,
        userCategoryId: createDto.userCategoryId,
        companyId: actingUserCompanyId,
        status: createDto.status || 'A',
        createdBy: actingUserId,
        updatedBy: actingUserId,
    };
    return this.prisma.user.create({ data: dataToCreate });
  }

  async findAllInCompany(companyId: number, page: number = 1, limit: number = 10) {
    const whereClause = { companyId, status: 'A' }; // Only active users
    const totalRecords = await this.prisma.user.count({ where: whereClause });
    const users = await this.prisma.user.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { username: 'asc' },
      include: { userCategory: true },
      select: { // Explicitly select fields to exclude passwordHash
          id: true, username: true, email: true, firstName: true, lastName: true, phone: true,
          status: true, companyId: true, userCategoryId: true, userCategory: true,
          createdAt: true, updatedAt: true, createdBy: true, updatedBy: true, lastLogin: true
      }
    });
    return {
        data: users,
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
    };
  }

  async findOneInCompany(userId: number, companyId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { userCategory: true, company: true },
      select: {
        id: true, username: true, email: true, firstName: true, lastName: true, phone: true,
        status: true, companyId: true, userCategoryId: true, userCategory: true, company: true,
        createdAt: true, updatedAt: true, createdBy: true, updatedBy: true, lastLogin: true
      }
    });
    if (!user || user.companyId !== companyId) {
      throw new NotFoundException(`User with ID ${userId} not found in this company.`);
    }
    return user;
  }

  async updateUser(userIdToUpdate: number, updateDto: UpdateUserDto, actingUserId: number, actingUserCompanyId: number) {
    const userToUpdate = await this.findOneInCompany(userIdToUpdate, actingUserCompanyId); // Ensures user is in admin's company

    if (updateDto.email && updateDto.email !== userToUpdate.email) {
        const existingUserByEmail = await this.findByEmail(actingUserCompanyId, updateDto.email);
        if (existingUserByEmail && existingUserByEmail.id !== userIdToUpdate) {
          throw new ConflictException(`Email '${updateDto.email}' is already in use in this company.`);
        }
    }

    if (updateDto.userCategoryId) {
        const userCategory = await this.prisma.usercategories.findUnique({ where: { id: updateDto.userCategoryId }});
        if (!userCategory || userCategory.companyId !== actingUserCompanyId) {
            throw new NotFoundException(`UserCategory with ID ${updateDto.userCategoryId} not found in this company.`);
        }
    }

    const dataToUpdate: any = { ...updateDto };
    delete dataToUpdate.password; // Ensure password is not updated here
    delete dataToUpdate.username; // Ensure username is not updated here
    delete dataToUpdate.companyId; // Ensure companyId is not updated here

    dataToUpdate.updatedBy = actingUserId;

    return this.prisma.user.update({
      where: { id: userIdToUpdate },
      data: dataToUpdate,
      select: { // Return updated user without password
        id: true, username: true, email: true, firstName: true, lastName: true, phone: true,
        status: true, companyId: true, userCategoryId: true, userCategory: true,
        createdAt: true, updatedAt: true, createdBy: true, updatedBy: true, lastLogin: true
      }
    });
  }

  async deactivateUser(userIdToDeactivate: number, actingUserId: number, actingUserCompanyId: number) {
    await this.findOneInCompany(userIdToDeactivate, actingUserCompanyId); // Ensures user is in admin's company & exists

    return this.prisma.user.update({
      where: { id: userIdToDeactivate },
      data: { status: 'I', updatedBy: actingUserId },
      select: { // Return updated user without password
        id: true, username: true, email: true, firstName: true, lastName: true, phone: true,
        status: true, companyId: true, userCategoryId: true, userCategory: true,
        createdAt: true, updatedAt: true, createdBy: true, updatedBy: true, lastLogin: true
      }
    });
  }

  // Method specifically for AuthService.register to use
  // It's slightly different from createByUserAdmin as it might be self-registration
  // and passwordHash is already computed.
  async internalCreateUser(data: CreateUserDto & { passwordHash: string, companyId: number, createdBy?: number, updatedBy?: number }) {
    const { password, ...userData } = data; // password field from CreateUserDto is not used here

    const existingUserByUsername = await this.findByUsername(userData.companyId, userData.username);
    if (existingUserByUsername) {
      throw new ConflictException(`Username '${userData.username}' already exists in this company.`);
    }
    const existingUserByEmail = await this.findByEmail(userData.companyId, userData.email);
    if (existingUserByEmail) {
      throw new ConflictException(`Email '${userData.email}' already exists in this company.`);
    }

    // Validate userCategoryId
    const userCategory = await this.prisma.usercategories.findUnique({ where: { id: userData.userCategoryId }});
    if (!userCategory || userCategory.companyId !== userData.companyId) {
        throw new NotFoundException(`UserCategory with ID ${userData.userCategoryId} not found in this company.`);
    }

    const userToCreate = {
        ...userData, // Contains passwordHash
        status: userData.status || 'A',
        // createdBy/updatedBy can be passed for seeding, or handled post-creation for self-id
    };
    const createdUser = await this.prisma.user.create({ data: userToCreate });

    // If createdBy/updatedBy were not provided, set them to the user's own ID
    if (data.createdBy === undefined || data.updatedBy === undefined) {
        return this.prisma.user.update({
            where: { id: createdUser.id },
            data: { createdBy: createdUser.id, updatedBy: createdUser.id },
            select: { // Return created user without password
                id: true, username: true, email: true, firstName: true, lastName: true, phone: true,
                status: true, companyId: true, userCategoryId: true, userCategory: true,
                createdAt: true, updatedAt: true, createdBy: true, updatedBy: true, lastLogin: true
            }
        });
    }
    // Exclude passwordHash from returned user
    const { passwordHash: omitPassword, ...result } = createdUser;
    return result;
  }
}
