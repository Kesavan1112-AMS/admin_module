import { Injectable, NotFoundException, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Prisma } from '@prisma/client';
import { BusinessRulesService } from '../business-rules/business-rules.service'; // Added

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessRulesService: BusinessRulesService, // Injected
    ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const whereClause = { status: 'A' };
    const totalRecords = await this.prisma.company.count({ where: whereClause });
    const companies = await this.prisma.company.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    });
    return {
        data: companies,
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
    };
  }

  async findOne(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id, status: 'A' }, // Ensure company is active
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found or is inactive.`);
    }
    return company;
  }

  async findByCode(code: string) {
    const company = await this.prisma.company.findUnique({
      where: { code, status: 'A' },
    });
     if (!company) {
      throw new NotFoundException(`Company with code ${code} not found or is inactive.`);
    }
    return company;
  }

  async create(createDto: CreateCompanyDto, actingUserId: number) {
    const existingCompanyByCode = await this.prisma.company.findUnique({ where: { code: createDto.code } });
    if (existingCompanyByCode) {
      throw new ConflictException(`Company with code ${createDto.code} already exists.`);
    }

    let themeConfigObject: Prisma.JsonObject | undefined = undefined;
    if (createDto.themeConfig) {
        try {
            themeConfigObject = JSON.parse(createDto.themeConfig) as Prisma.JsonObject;
        } catch (error) {
            throw new ConflictException('Invalid themeConfig JSON string.');
        }
    }

    const dataToCreate = {
      name: createDto.name,
      code: createDto.code,
      logoUrl: createDto.logoUrl,
      themeConfig: themeConfigObject,
      status: createDto.status || 'A',
      createdBy: actingUserId,
      updatedBy: actingUserId,
    };

    const newCompany = await this.prisma.company.create({ data: dataToCreate });

    // TODO - Orchestration Post-Company Creation:
    // 1. Create a default Admin User for this newCompany.id
    // 2. Create default UserCategories for this newCompany.id
    // 3. Seed default Modules, PrivilegeMaster, RolePrivileges for this newCompany.id
    // 4. Seed default UiMenu, UiPage, etc. via UiConfigService for this newCompany.id
    // 5. Seed default CompanyConfigurations (e.g., specific theme values) via CompanyConfigurationService
    // This often involves calling other services and should be handled carefully, potentially in a transaction.
    // For now, this service only creates the company record.

    return newCompany;
  }

  async update(id: number, updateDto: UpdateCompanyDto, actingUserId: number) {
    await this.findOne(id); // Ensures company exists and is active

    let themeConfigObject: Prisma.JsonObject | undefined = undefined;
    if (updateDto.themeConfig) {
        try {
            themeConfigObject = JSON.parse(updateDto.themeConfig) as Prisma.JsonObject;
        } catch (error) {
            throw new ConflictException('Invalid themeConfig JSON string.');
        }
    }

    const dataToUpdate: any = { ...updateDto };
    if (themeConfigObject !== undefined) {
        dataToUpdate.themeConfig = themeConfigObject;
    } else if (updateDto.themeConfig === null) { // Explicitly clear themeConfig
        dataToUpdate.themeConfig = Prisma.DbNull;
    }


    delete dataToUpdate.code; // Code should not be updatable
    dataToUpdate.updatedBy = actingUserId;

    return this.prisma.company.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async delete(id: number, actingUserId: number) {
    await this.findOne(id); // Ensures company exists and is active

    // TODO: Consider implications - deactivating users, archiving data, etc.
    // This might be a complex operation requiring transactions and checks.
    return this.prisma.company.update({
      where: { id },
      data: { status: 'I', updatedBy: actingUserId },
    });
  }

  // UI and generic configuration methods (getMenuConfiguration, getThemeConfiguration, getPageConfiguration,
  // getConfiguration, setConfiguration) have been removed.
  // These responsibilities are now with UiConfigService and CompanyConfigurationService respectively.
  // The Company entity itself has a themeConfig field for storing its specific theme values.
}
