import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateUserPrivilegeDto } from './dto/create-user-privilege.dto';
import { UpdateUserPrivilegeDto } from './dto/update-user-privilege.dto';

@Injectable()
export class UserPrivilegeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserPrivilegeDto) {
    const { updatedAt, ...createData } = data as any;
    return this.prisma.userprivileges.create({ data: createData });
  }

  async findAll(companyId: number) {
    return this.prisma.userprivileges.findMany({ where: { companyId } });
  }

  async findAllByUserKey(userKey: string, status?: string) {
    // First find the user to get their companyId
    const user = await this.prisma.user.findFirst({
      where: { id: parseInt(userKey) },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Then find all privileges for that user's company
    return this.prisma.userprivileges.findMany({
      where: {
        companyId: user.companyId,
        userId: user.id,
        ...(status && { status }),
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.userprivileges.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateUserPrivilegeDto) {
    return this.prisma.userprivileges.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.userprivileges.delete({ where: { id } });
  }
}
