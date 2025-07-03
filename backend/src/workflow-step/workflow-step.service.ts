import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateWorkflowStepDto } from './dto/create-workflow-step.dto';
import { UpdateWorkflowStepDto } from './dto/update-workflow-step.dto';

@Injectable()
export class WorkflowStepService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateWorkflowStepDto) {
    const { updatedAt, ...createData } = data as any;
    return this.prisma.workflowsteps.create({ data: createData });
  }

  async findAll(companyId: number) {
    return this.prisma.workflowsteps.findMany({ where: { companyId } });
  }

  async findOne(id: number) {
    return this.prisma.workflowsteps.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateWorkflowStepDto) {
    return this.prisma.workflowsteps.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.workflowsteps.delete({ where: { id } });
  }
}
