import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateWorkflowInstanceDto } from './dto/create-workflow-instance.dto';
import { UpdateWorkflowInstanceDto } from './dto/update-workflow-instance.dto';

@Injectable()
export class WorkflowInstanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateWorkflowInstanceDto) {
    const { updatedAt, ...createData } = data as any;
    return this.prisma.workflowinstances.create({ data: createData });
  }

  async findAll(companyId: number) {
    return this.prisma.workflowinstances.findMany({ where: { companyId } });
  }

  async findOne(id: number) {
    return this.prisma.workflowinstances.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateWorkflowInstanceDto) {
    return this.prisma.workflowinstances.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.workflowinstances.delete({ where: { id } });
  }
}
