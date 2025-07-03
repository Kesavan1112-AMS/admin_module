import { Injectable, NotFoundException, ForbiddenException, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateCompanyConfigurationDto } from './dto/create-company-configuration.dto';
import { UpdateCompanyConfigurationDto } from './dto/update-company-configuration.dto';
import { BusinessRulesService } from '../business-rules/business-rules.service'; // Added

@Injectable()
export class CompanyConfigurationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessRulesService: BusinessRulesService, // Injected
    ) {}

  async create(createDto: CreateCompanyConfigurationDto, userId: number, companyId: number) {
    if (createDto.companyId && createDto.companyId !== companyId) {
      throw new ForbiddenException('CompanyId mismatch for configuration creation.');
    }

    const existingConfig = await this.prisma.companyconfigurations.findUnique({
      where: { companyId_configKey: { companyId, configKey: createDto.configKey } },
    });
    if (existingConfig && existingConfig.status !== 'D') { // Allow creation if previous was soft-deleted
      throw new ConflictException(`Configuration with key ${createDto.configKey} already exists for this company.`);
    }

    // If it was soft-deleted, we might "revive" and update it, or create a new one.
    // For simplicity here, we'll assume a new one if truly new, or error if active.
    // A more advanced logic could handle reviving.

    const dataToCreate = {
      ...createDto,
      companyId: companyId,
      status: createDto.status || 'A',
      createdBy: userId,
      updatedBy: userId,
    };
    return this.prisma.companyconfigurations.create({ data: dataToCreate });
  }

  async findAll(companyId: number) {
    return this.prisma.companyconfigurations.findMany({
      where: { companyId, status: 'A' },
      select: { id: true, configKey: true, configValue: true, description: true, status: true } // Avoid sending audit fields unless necessary
    });
  }

  async findOneByKey(configKey: string, companyId: number) {
    const config = await this.prisma.companyconfigurations.findUnique({
      where: { companyId_configKey: { companyId, configKey } },
    });
    if (!config || config.status === 'D') { // Also check for soft-deleted
      throw new NotFoundException(`Configuration with key '${configKey}' not found or inactive for this company.`);
    }
     // Only return relevant fields
    const { createdBy, updatedBy, createdAt, updatedAt, ...result } = config;
    return result;
  }

  async update(configKey: string, updateDto: UpdateCompanyConfigurationDto, userId: number, companyId: number) {
    const config = await this.prisma.companyconfigurations.findUnique({
      where: { companyId_configKey: { companyId, configKey } },
    });
    if (!config || config.status === 'D') {
      throw new NotFoundException(`Configuration with key '${configKey}' not found or inactive for this company.`);
    }

    // Prevent changing companyId or configKey itself via this method
    const { companyId: dtoCompanyId, configKey: dtoConfigKey, createdBy: dtoCreatedBy, ...restOfDto } = updateDto;

    const dataToUpdate = {
      ...restOfDto, // Can update configValue, description, status
      updatedBy: userId,
    };
    return this.prisma.companyconfigurations.update({
      where: { id: config.id }, // Use the actual ID of the record
      data: dataToUpdate,
    });
  }

  async remove(configKey: string, companyId: number, userId: number) {
    const config = await this.prisma.companyconfigurations.findUnique({
      where: { companyId_configKey: { companyId, configKey } },
    });
    if (!config || config.status === 'D') { // Check if already soft-deleted
      throw new NotFoundException(`Configuration with key '${configKey}' not found or already inactive for this company.`);
    }

    return this.prisma.companyconfigurations.update({
      where: { id: config.id },
      data: {
        status: 'D', // Soft delete
        updatedBy: userId,
      },
    });
  }

  // Retain specific getters if they are commonly used and provide default values or specific formatting
  async getSpecificConfig(configKey: string, companyId: number, defaultValue: any = {}) {
    try {
        const config = await this.findOneByKey(configKey, companyId);
        return config?.configValue || defaultValue;
    } catch (error) {
        if (error instanceof NotFoundException) {
            return defaultValue;
        }
        throw error;
    }
  }

  // Example: Get UI Theme (can use getSpecificConfig internally)
  async getThemeConfig(companyId: number) {
    return this.getSpecificConfig('ui.theme', companyId, { primary: '#000000' /* some default theme */ });
  }
}
