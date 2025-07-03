import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateUserSessionDto } from './dto/create-user-session.dto';
import { UpdateUserSessionDto } from './dto/update-user-session.dto';

@Injectable()
export class UserSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserSessionDto) {
    const { updatedAt, ...createData } = data as any;
    return this.prisma.usersessions.create({ data: createData });
  }

  async findAll(companyId: number) {
    return this.prisma.usersessions.findMany({
      where: {
        users: { companyId },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.usersessions.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateUserSessionDto) {
    return this.prisma.usersessions.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.usersessions.delete({ where: { id } });
  }
}
