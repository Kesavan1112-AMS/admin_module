import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateMasterHierarchyDto } from './dto/create-master-hierarchy.dto';
import { UpdateMasterHierarchyDto } from './dto/update-master-hierarchy.dto';

@Injectable()
export class MasterHierarchyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMasterHierarchyDto) {
    const { updatedAt, ...createData } = data as any;
    return this.prisma.masterhierarchy.create({ data: createData });
  }

  async findAll(companyId: number) {
    return this.prisma.masterhierarchy.findMany({ where: { companyId } });
  }

  async findOne(id: number) {
    return this.prisma.masterhierarchy.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateMasterHierarchyDto) {
    return this.prisma.masterhierarchy.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.masterhierarchy.delete({ where: { id } });
  }
}
