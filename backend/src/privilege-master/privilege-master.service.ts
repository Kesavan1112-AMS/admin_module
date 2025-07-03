import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreatePrivilegeMasterDto } from './dto/create-privilege-master.dto';
import { UpdatePrivilegeMasterDto } from './dto/update-privilege-master.dto';

@Injectable()
export class PrivilegeMasterService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePrivilegeMasterDto) {
    const { updatedAt, ...createData } = data as any;
    return this.prisma.privilegemaster.create({ data: createData });
  }

  async findAll(companyId: number) {
    return this.prisma.privilegemaster.findMany({ where: { companyId } });
  }

  async findOne(id: number) {
    return this.prisma.privilegemaster.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdatePrivilegeMasterDto) {
    return this.prisma.privilegemaster.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.privilegemaster.delete({ where: { id } });
  }
}
