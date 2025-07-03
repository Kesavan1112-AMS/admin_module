import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateMasterDataRelationshipsDto } from './dto/create-master-data-relationships.dto';
import { UpdateMasterDataRelationshipsDto } from './dto/update-master-data-relationships.dto';

@Injectable()
export class MasterDataRelationshipsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMasterDataRelationshipsDto) {
    const { updatedAt, ...createData } = data as any;
    return this.prisma.masterdatarelationships.create({ data: createData });
  }

  async findAll(companyId: number) {
    return this.prisma.masterdatarelationships.findMany({
      where: { companyId },
    });
  }

  async findOne(id: number) {
    return this.prisma.masterdatarelationships.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateMasterDataRelationshipsDto) {
    return this.prisma.masterdatarelationships.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.masterdatarelationships.delete({ where: { id } });
  }
}
