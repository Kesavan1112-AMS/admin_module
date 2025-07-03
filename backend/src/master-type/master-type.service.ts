import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';

@Injectable()
export class MasterTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.mastertypes.create({ data });
  }

  async findAll(companyId: number) {
    return this.prisma.mastertypes.findMany({ where: { companyId } });
  }

  async findOne(id: number) {
    return this.prisma.mastertypes.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    return this.prisma.mastertypes.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.mastertypes.delete({ where: { id } });
  }
}
