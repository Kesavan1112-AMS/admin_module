import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateRolePrivilegeDto } from './dto/create-role-privilege.dto';
import { UpdateRolePrivilegeDto } from './dto/update-role-privilege.dto';

@Injectable()
export class RolePrivilegeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRolePrivilegeDto) {
    const { updatedAt, ...createData } = data as any;
    return this.prisma.roleprivileges.create({ data: createData });
  }

  async findAll(companyId: number) {
    return this.prisma.roleprivileges.findMany({ where: { companyId } });
  }

  async findOne(id: number) {
    return this.prisma.roleprivileges.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateRolePrivilegeDto) {
    return this.prisma.roleprivileges.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.roleprivileges.delete({ where: { id } });
  }
}
