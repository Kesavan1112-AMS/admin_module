import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateWorkflowStepHistoryDto } from './dto/create-workflow-step-history.dto';
// UpdateWorkflowStepHistoryDto might not be needed if history is immutable

@Injectable()
export class WorkflowStepHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  // This method is intended to be called internally by other services (e.g., WorkflowInstanceService)
  async logAction(dto: CreateWorkflowStepHistoryDto, instanceCompanyId: number) {
    // Validate workflowInstanceId
    const workflowInstance = await this.prisma.workflowinstances.findUnique({
      where: { id: dto.workflowInstanceId },
    });
    if (!workflowInstance || workflowInstance.companyId !== instanceCompanyId) {
      throw new NotFoundException(
        `WorkflowInstance with ID ${dto.workflowInstanceId} not found or does not belong to the specified company.`,
      );
    }

    // Validate stepId (ensure it's a valid step, potentially related to the instance's workflow definition - more complex)
    const workflowStep = await this.prisma.workflowsteps.findUnique({
        where: { id: dto.stepId }
    });
    if (!workflowStep || workflowStep.companyId !== instanceCompanyId) { // Assuming steps are also company-scoped
        throw new NotFoundException(`WorkflowStep with ID ${dto.stepId} not found or not part of this company.`);
    }

    // Validate actionBy user
     const actionByUser = await this.prisma.user.findUnique({ where: { id: dto.actionBy }});
     if (!actionByUser || actionByUser.companyId !== instanceCompanyId) {
         throw new NotFoundException(`User (actionBy) with ID ${dto.actionBy} not found or not part of this company.`);
     }

    return this.prisma.workflowstephistory.create({
      data: {
        workflowInstanceId: dto.workflowInstanceId,
        stepId: dto.stepId,
        actionTaken: dto.actionTaken,
        comments: dto.comments,
        actionBy: dto.actionBy,
        // createdAt is handled by Prisma @default(now())
      },
    });
  }

  async findAllByInstanceId(workflowInstanceId: number, companyId: number) {
    // First, verify the instance belongs to the company making the request
    const workflowInstance = await this.prisma.workflowinstances.findUnique({
      where: { id: workflowInstanceId },
    });
    if (!workflowInstance || workflowInstance.companyId !== companyId) {
      throw new NotFoundException(
        `WorkflowInstance with ID ${workflowInstanceId} not found in this company.`,
      );
    }

    return this.prisma.workflowstephistory.findMany({
      where: { workflowInstanceId },
      orderBy: { createdAt: 'asc' },
      include: {
        users: { select: { id: true, username: true, email: true } }, // User who performed the action
        workflowsteps: true, // The step related to this history entry
      },
    });
  }

  // findOne, update, and remove methods are generally not suitable for history records
  // as history should be immutable. If specific use cases arise, they can be added with caution.
}
