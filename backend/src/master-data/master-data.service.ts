import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';

@Injectable()
export class MasterDataService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.masterdata.create({ data });
  }

  async findAll(companyId: number) {
    return this.prisma.masterdata.findMany({ where: { companyId } });
  }

  async findOne(id: number) {
    return this.prisma.masterdata.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    return this.prisma.masterdata.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.masterdata.delete({ where: { id } });
  }
}
