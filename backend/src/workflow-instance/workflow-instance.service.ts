import { Injectable, NotFoundException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateWorkflowInstanceDto } from './dto/create-workflow-instance.dto';
import { UpdateWorkflowInstanceDto } from './dto/update-workflow-instance.dto';
import { BusinessRulesService } from '../business-rules/business-rules.service'; // Added

@Injectable()
export class WorkflowInstanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessRulesService: BusinessRulesService, // Injected
    ) {}

  private async validateRelations(dto: { currentStepId?: number }, companyId: number) {
    if (dto.currentStepId) {
      const step = await this.prisma.workflowsteps.findUnique({ where: { id: dto.currentStepId } });
      if (!step || step.companyId !== companyId) {
        throw new NotFoundException(`CurrentStepId ${dto.currentStepId} not found or not part of this company.`);
      }
    }
    // Further validation for entityType/entityId might be needed here or at a higher level
    // e.g., check if this.prisma[dto.entityType.toLowerCase()].findUnique({ where: { id: dto.entityId, companyId }})
  }

  async create(createDto: CreateWorkflowInstanceDto, userId: number, companyId: number) {
    if (createDto.companyId && createDto.companyId !== companyId) {
      throw new ForbiddenException('CompanyId mismatch for workflow instance creation.');
    }
    await this.validateRelations(createDto, companyId);

    const dataToCreate = {
      ...createDto,
      companyId: companyId,
      status: createDto.status || 'pending', // Default status
      createdBy: userId,
      updatedBy: userId,
    };
    return this.prisma.workflowinstances.create({ data: dataToCreate });
  }

  async findAll(companyId: number, entityType?: string, entityId?: number, status?: string, currentStepId?: number) {
    const whereClause: any = { companyId };
    if (entityType) whereClause.entityType = entityType;
    if (entityId) whereClause.entityId = entityId;
    if (status) whereClause.status = status; else whereClause.status = { notIn: ['cancelled', 'archived'] }; // Default to not showing cancelled/archived
    if (currentStepId) whereClause.currentStepId = currentStepId;

    return this.prisma.workflowinstances.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        workflowsteps: true, // current step
        // Consider including limited history count or specific fields if needed for list view
      },
    });
  }

  async findOne(id: number, companyId: number) {
    const instance = await this.prisma.workflowinstances.findUnique({
      where: { id },
      include: {
        workflowsteps: true, // current step
        workflowstephistory: { // Full history for detail view
          orderBy: { createdAt: 'asc' },
          include: {
            users: { select: { id: true, username: true, email: true } }, // User who actioned
            workflowsteps: true // The step in history
          }
        }
      },
    });
    if (!instance || instance.companyId !== companyId) {
      throw new NotFoundException(`WorkflowInstance with ID ${id} not found in this company.`);
    }
    return instance;
  }

  async update(id: number, updateDto: UpdateWorkflowInstanceDto, userId: number, companyId: number) {
    const instance = await this.prisma.workflowinstances.findUnique({ where: { id } });
    if (!instance || instance.companyId !== companyId) {
      throw new NotFoundException(`WorkflowInstance with ID ${id} not found in this company.`);
    }

    await this.validateRelations(updateDto, companyId);
    // Prevent changing core identifiers of an instance
    const { companyId: dtoCompanyId, entityId: dtoEntityId, entityType: dtoEntityType, createdBy: dtoCreatedBy, ...restOfDto } = updateDto;

    if (dtoEntityId && dtoEntityId !== instance.entityId) throw new ForbiddenException('Cannot change entityId of an instance.');
    if (dtoEntityType && dtoEntityType !== instance.entityType) throw new ForbiddenException('Cannot change entityType of an instance.');


    const dataToUpdate = {
      ...restOfDto, // Typically currentStepId and status are updated
      updatedBy: userId,
    };
    return this.prisma.workflowinstances.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  // Typically, instances are not hard-deleted. They are completed, cancelled, or archived.
  // This method could be for cancelling a pending instance.
  async cancel(id: number, companyId: number, userId: number) {
    const instance = await this.prisma.workflowinstances.findUnique({ where: { id } });
    if (!instance || instance.companyId !== companyId) {
      throw new NotFoundException(`WorkflowInstance with ID ${id} not found in this company.`);
    }
    if (instance.status !== 'pending' && instance.status !== 'in_progress') { // Example condition
        throw new ForbiddenException(`Workflow instance cannot be cancelled as it is already ${instance.status}.`);
    }

    return this.prisma.workflowinstances.update({
      where: { id },
      data: {
        status: 'cancelled', // Or 'archived'
        updatedBy: userId,
      },
    });
  }
}
