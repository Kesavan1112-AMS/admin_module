import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateUserMasterMappingDto } from './dto/create-user-master-mapping.dto';
import { UpdateUserMasterMappingDto } from './dto/update-user-master-mapping.dto';

@Injectable()
export class UserMasterMappingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserMasterMappingDto) {
    const { updatedAt, ...createData } = data as any;
    return this.prisma.usermastermappings.create({ data: createData });
  }

  async findAll(companyId: number) {
    return this.prisma.usermastermappings.findMany({ where: { companyId } });
  }

  async findOne(id: number) {
    return this.prisma.usermastermappings.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateUserMasterMappingDto) {
    return this.prisma.usermastermappings.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.usermastermappings.delete({ where: { id } });
  }
}
