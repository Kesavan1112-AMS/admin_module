import { Injectable, NotFoundException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateWorkflowStepDto } from './dto/create-workflow-step.dto';
import { UpdateWorkflowStepDto } from './dto/update-workflow-step.dto';
import { BusinessRulesService } from '../business-rules/business-rules.service'; // Added

@Injectable()
export class WorkflowStepService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessRulesService: BusinessRulesService, // Injected
    ) {}

  private async validateRelations(dto: CreateWorkflowStepDto | UpdateWorkflowStepDto, companyId: number) {
    if (dto.requiredUserCategoryId) {
      const userCategory = await this.prisma.usercategories.findUnique({ where: { id: dto.requiredUserCategoryId } });
      if (!userCategory || userCategory.companyId !== companyId) {
        throw new NotFoundException(`RequiredUserCategory with ID ${dto.requiredUserCategoryId} not found in this company.`);
      }
    }
    if (dto.requiredPrivilegeId) {
      const privilege = await this.prisma.privilegemaster.findUnique({ where: { id: dto.requiredPrivilegeId } });
      if (!privilege || privilege.companyId !== companyId) {
        throw new NotFoundException(`RequiredPrivilege with ID ${dto.requiredPrivilegeId} not found in this company.`);
      }
    }
  }

  async create(createDto: CreateWorkflowStepDto, userId: number, companyId: number) {
    if (createDto.companyId && createDto.companyId !== companyId) {
      throw new ForbiddenException('CompanyId mismatch for workflow step creation.');
    }
    await this.validateRelations(createDto, companyId);

    const dataToCreate = {
      ...createDto,
      companyId: companyId,
      status: createDto.status || 'A',
      createdBy: userId,
      updatedBy: userId,
    };
    return this.prisma.workflowsteps.create({ data: dataToCreate });
  }

  async findAll(companyId: number) {
    return this.prisma.workflowsteps.findMany({
      where: { companyId, status: 'A' },
      orderBy: { stepOrder: 'asc' },
      include: {
        usercategories: true, // Renamed from userCategories to match Prisma schema
        privilegemaster: true, // Renamed from privilegeMaster
      },
    });
  }

  async findOne(id: number, companyId: number) {
    const workflowStep = await this.prisma.workflowsteps.findUnique({
      where: { id },
      include: {
        usercategories: true,
        privilegemaster: true,
      },
    });
    if (!workflowStep || workflowStep.companyId !== companyId) {
      throw new NotFoundException(`WorkflowStep with ID ${id} not found in this company.`);
    }
    return workflowStep;
  }

  async update(id: number, updateDto: UpdateWorkflowStepDto, userId: number, companyId: number) {
    const workflowStep = await this.prisma.workflowsteps.findUnique({ where: { id } });
    if (!workflowStep || workflowStep.companyId !== companyId) {
      throw new NotFoundException(`WorkflowStep with ID ${id} not found in this company.`);
    }

    await this.validateRelations(updateDto, companyId);
    const { companyId: dtoCompanyId, createdBy: dtoCreatedBy, ...restOfDto } = updateDto;

    const dataToUpdate = {
      ...restOfDto,
      updatedBy: userId,
    };
    return this.prisma.workflowsteps.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number, companyId: number, userId: number) {
    const workflowStep = await this.prisma.workflowsteps.findUnique({ where: { id } });
    if (!workflowStep || workflowStep.companyId !== companyId) {
      throw new NotFoundException(`WorkflowStep with ID ${id} not found in this company.`);
    }
    return this.prisma.workflowsteps.update({
      where: { id },
      data: {
        status: 'D',
        updatedBy: userId,
      },
    });
  }
}
