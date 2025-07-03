import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateModuleDto) {
    return this.prisma.module.create({ data });
  }

  async findAll(companyId: number) {
    return this.prisma.module.findMany({ where: { companyId } });
  }

  async findOne(id: number) {
    return this.prisma.module.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateModuleDto) {
    return this.prisma.module.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.module.delete({ where: { id } });
  }
}
