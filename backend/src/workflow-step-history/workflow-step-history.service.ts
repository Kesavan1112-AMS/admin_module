import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateWorkflowStepHistoryDto } from './dto/create-workflow-step-history.dto';
import { UpdateWorkflowStepHistoryDto } from './dto/update-workflow-step-history.dto';

@Injectable()
export class WorkflowStepHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateWorkflowStepHistoryDto) {
    return this.prisma.workflowstephistory.create({ data });
  }

  async findAll(companyId: number) {
    return this.prisma.workflowstephistory.findMany({
      where: {
        workflowinstances: { companyId },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.workflowstephistory.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateWorkflowStepHistoryDto) {
    return this.prisma.workflowstephistory.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.workflowstephistory.delete({ where: { id } });
  }
}
